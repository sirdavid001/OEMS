import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Exam, Prisma, ExamAttempt, AttemptStatus } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any) {
    const where: Prisma.ExamWhereInput = {
      isPublished: true,
    };

    if (user.role === 'ADMIN') {
      delete where.isPublished; // Admin sees all
    } else if (user.role === 'STUDENT') {
      // Student sees exams targeted at their faculty/dept OR general ones
      where.OR = [
        { faculty: null, department: null },
        { faculty: user.faculty, department: null },
        { faculty: user.faculty, department: user.department }
      ];
    } else if (user.role === 'INSTRUCTOR' || user.role === 'DEAN' || user.role === 'HOD') {
      // Instructors see exams they created OR ones in their faculty
      where.OR = [
        { instructorId: user.id },
        { faculty: user.faculty }
      ];
    }

    return this.prisma.exam.findMany({
      where,
      include: { 
        instructor: { select: { name: true } },
        _count: { select: { questions: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyExams(instructorId: string) {
    return this.prisma.exam.findMany({
      where: { instructorId },
      include: { _count: { select: { questions: true, attempts: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async create(data: any) {
    const { questions, ...examData } = data;
    
    return this.prisma.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          ...examData,
          questions: {
            create: questions.map((q: any) => ({
              type: q.type,
              content: q.content || q.text, // Handle both payload styles
              options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : null,
              answer: q.answer,
              points: parseInt(q.points) || 1,
            }))
          }
        },
        include: { questions: true }
      });
      return exam;
    });
  }

  async update(id: string, data: Prisma.ExamUpdateInput) {
    return this.prisma.exam.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.exam.delete({ where: { id } });
  }

  async startAttempt(userId: string, examId: string) {
    return this.prisma.examAttempt.create({
      data: {
        userId,
        examId,
        status: 'STARTED',
      },
    });
  }

  async submitAttempt(attemptId: string, answers: { questionId: string; response: string }[]) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: { include: { questions: true } } },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status === AttemptStatus.SUBMITTED) return attempt;

    let score = 0;
    const studentAnswersData = [];

    for (const answer of answers) {
      const question = attempt.exam.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      let pointsEarned = 0;
      if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
        if (question.answer === answer.response) {
          pointsEarned = question.points;
        }
      }
      
      score += pointsEarned;
      studentAnswersData.push({
        questionId: question.id,
        response: answer.response,
        pointsEarned,
      });
    }

    return this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        status: AttemptStatus.SUBMITTED,
        submitTime: new Date(),
        answers: {
          createMany: {
            data: studentAnswersData,
          },
        },
      },
    });
  }

  async generateResultPdf(attemptId: string, res: any) {
    const PDFDocument = require('pdfkit');
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        user: true,
      },
    });

    if (!attempt) throw new Error('Attempt not found');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=result-${attemptId}.pdf`);
    doc.pipe(res);

    doc.fontSize(25).text('OFFICIAL EXAM RESULT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Exam: ${attempt.exam.title}`);
    doc.text(`Candidate: ${attempt.user.name}`);
    doc.text(`Score: ${attempt.score}%`);
    doc.text(`Status: ${attempt.status}`);
    doc.text(`Completion Date: ${new Date().toLocaleDateString()}`);
    
    doc.moveDown();
    doc.fontSize(12).text('Generated by OEMS System', { align: 'center', oblique: true });
    doc.end();
  }

  async getResults(userId: string) {
    return this.prisma.examAttempt.findMany({
      where: { userId, status: AttemptStatus.SUBMITTED },
      include: { exam: true },
      orderBy: { submitTime: 'desc' },
    });
  }

  async getStudentStats(userId: string) {
    const attempts = await this.prisma.examAttempt.findMany({
      where: { userId, status: AttemptStatus.SUBMITTED },
      include: { exam: true },
    });

    const totalExams = attempts.length;
    const averageScore = totalExams > 0 
      ? attempts.reduce((acc, curr) => acc + curr.score, 0) / totalExams 
      : 0;
    
    // Simple mock for "Hours Spent" based on exam durations
    const totalMinutes = attempts.reduce((acc, curr) => acc + curr.exam.duration, 0);
    const hoursSpent = Math.floor(totalMinutes / 60);

    return {
      totalExams,
      completedExams: totalExams,
      averageScore: Math.round(averageScore),
      hoursSpent: `${hoursSpent}h`,
      recentAttempts: attempts.slice(0, 3).map(a => ({
        id: a.id,
        examTitle: a.exam.title,
        score: a.score,
        date: a.submitTime,
      })),
    };
  }

  async getAttemptDetails(attemptId: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: true,
          },
        },
        answers: true,
      },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    return attempt;
  }
  async getInstructorStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { examsCreated: true } } }
    });

    const exams = await this.prisma.exam.findMany({
      where: { instructorId: userId },
      include: { _count: { select: { attempts: true } } }
    });

    const totalAttempts = exams.reduce((acc, curr) => acc + curr._count.attempts, 0);
    
    return {
      totalExams: user?._count.examsCreated || 0,
      totalAttempts,
      activeExams: exams.filter(e => e.isPublished).length,
      recentCreated: exams.slice(0, 3).map(e => ({
        id: e.id,
        title: e.title,
        attempts: e._count.attempts,
        date: e.createdAt,
      })),
    };
  }
}
