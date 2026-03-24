"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
let ExamsService = class ExamsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async findAll(user) {
        const where = {
            isPublished: true,
        };
        if (user.role === 'ADMIN') {
            delete where.isPublished;
        }
        else if (user.role === 'STUDENT') {
            where.OR = [
                { faculty: null, department: null },
                { faculty: user.faculty, department: null },
                { faculty: user.faculty, department: user.department }
            ];
        }
        else if (user.role === 'LECTURER' || user.role === 'DEAN' || user.role === 'HOD') {
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
    async findMyExams(instructorId) {
        return this.prisma.exam.findMany({
            where: { instructorId },
            include: { _count: { select: { questions: true, attempts: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: { questions: true },
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        return exam;
    }
    async create(data) {
        const { questions, ...examData } = data;
        return this.prisma.$transaction(async (tx) => {
            const exam = await tx.exam.create({
                data: {
                    ...examData,
                    questions: {
                        create: questions.map((q) => ({
                            type: q.type,
                            content: q.content || q.text,
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
    async update(id, data) {
        const oldExam = await this.prisma.exam.findUnique({ where: { id } });
        const exam = await this.prisma.exam.update({ where: { id }, data });
        if (data.isPublished === true && (!oldExam || !oldExam.isPublished)) {
            const students = await this.prisma.user.findMany({
                where: {
                    role: 'STUDENT',
                    status: 'APPROVED',
                    OR: [
                        { faculty: exam.faculty, department: exam.department },
                        { faculty: exam.faculty, department: null },
                        { faculty: null, department: null },
                    ],
                },
            });
            for (const student of students) {
                await this.mailService.sendExamScheduled(student.email, student.name, exam.title, exam.startTime, exam.duration);
            }
        }
        return exam;
    }
    async delete(id) {
        return this.prisma.exam.delete({ where: { id } });
    }
    async startAttempt(userId, examId) {
        return this.prisma.examAttempt.create({
            data: {
                userId,
                examId,
                status: 'STARTED',
            },
        });
    }
    async submitAttempt(attemptId, answers) {
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: { exam: { include: { questions: true } } },
        });
        if (!attempt)
            throw new common_1.NotFoundException('Attempt not found');
        if (attempt.status === client_1.AttemptStatus.SUBMITTED)
            return attempt;
        let score = 0;
        const studentAnswersData = [];
        for (const answer of answers) {
            const question = attempt.exam.questions.find((q) => q.id === answer.questionId);
            if (!question)
                continue;
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
        const updatedAttempt = await this.prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                score,
                status: client_1.AttemptStatus.SUBMITTED,
                submitTime: new Date(),
                answers: {
                    createMany: {
                        data: studentAnswersData,
                    },
                },
            },
            include: { user: true, exam: true },
        });
        await this.mailService.sendResultAvailable(updatedAttempt.user.email, updatedAttempt.user.name, updatedAttempt.exam.title, updatedAttempt.score);
        return updatedAttempt;
    }
    async generateResultPdf(attemptId, res) {
        const PDFDocument = require('pdfkit');
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: true,
                user: true,
            },
        });
        if (!attempt)
            throw new Error('Attempt not found');
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
    async getResults(userId) {
        return this.prisma.examAttempt.findMany({
            where: { userId, status: client_1.AttemptStatus.SUBMITTED },
            include: { exam: true },
            orderBy: { submitTime: 'desc' },
        });
    }
    async getStudentStats(userId) {
        const attempts = await this.prisma.examAttempt.findMany({
            where: { userId, status: { in: [client_1.AttemptStatus.SUBMITTED, client_1.AttemptStatus.GRADED] } },
            include: { exam: true },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const upcomingExams = await this.prisma.exam.findMany({
            where: {
                isPublished: true,
                faculty: user?.faculty,
                OR: [
                    { department: user?.department },
                    { department: null },
                ],
                startTime: { gt: new Date() },
            },
            orderBy: { startTime: 'asc' },
            take: 2,
        });
        const totalExams = attempts.length;
        const averageScore = totalExams > 0
            ? attempts.reduce((acc, curr) => acc + curr.score, 0) / totalExams
            : 0;
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
                date: a.submitTime || a.startTime,
            })),
            upcomingExams: upcomingExams.map(e => ({
                id: e.id,
                title: e.title,
                date: e.startTime,
                duration: e.duration,
            })),
        };
    }
    async getAttemptDetails(attemptId) {
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
        if (!attempt)
            throw new common_1.NotFoundException('Attempt not found');
        return attempt;
    }
    async getExamAttempts(examId) {
        return this.prisma.examAttempt.findMany({
            where: { examId },
            include: {
                user: { select: { name: true, email: true, registrationNumber: true, staffId: true } },
            },
            orderBy: { submitTime: 'desc' },
        });
    }
    async gradeAttempt(attemptId, grades) {
        return this.prisma.$transaction(async (tx) => {
            for (const grade of grades) {
                await tx.studentAnswer.updateMany({
                    where: { attemptId, questionId: grade.questionId },
                    data: {
                        pointsEarned: grade.points,
                        feedback: grade.feedback,
                    },
                });
            }
            const allAnswers = await tx.studentAnswer.findMany({
                where: { attemptId },
            });
            const totalScore = allAnswers.reduce((acc, curr) => acc + curr.pointsEarned, 0);
            return tx.examAttempt.update({
                where: { id: attemptId },
                data: {
                    score: totalScore,
                    status: client_1.AttemptStatus.GRADED,
                },
            });
        });
    }
    async getStudentStats(userId) {
        const attempts = await this.prisma.examAttempt.findMany({
            where: { userId, status: { in: [client_1.AttemptStatus.SUBMITTED, client_1.AttemptStatus.GRADED] } },
            include: { exam: true },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const upcomingExams = await this.prisma.exam.findMany({
            where: {
                isPublished: true,
                faculty: user?.faculty,
                OR: [
                    { department: user?.department },
                    { department: null },
                ],
                startTime: { gt: new Date() },
            },
            orderBy: { startTime: 'asc' },
            take: 2,
        });
        const totalExams = attempts.length;
        const averageScore = totalExams > 0
            ? attempts.reduce((acc, curr) => acc + curr.score, 0) / totalExams
            : 0;
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
                date: a.submitTime || a.startTime,
            })),
            upcomingExams: upcomingExams.map(e => ({
                id: e.id,
                title: e.title,
                date: e.startTime,
                duration: e.duration,
            })),
        };
    }
    async getLecturerStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { _count: { select: { examsCreated: true } } }
        });
        const exams = await this.prisma.exam.findMany({
            where: { instructorId: userId },
            include: {
                _count: {
                    select: {
                        attempts: { where: { status: client_1.AttemptStatus.SUBMITTED } }
                    }
                }
            }
        });
        const totalAttempts = await this.prisma.examAttempt.count({
            where: { exam: { instructorId: userId } }
        });
        const pendingGrading = exams.reduce((acc, curr) => acc + curr._count.attempts, 0);
        return {
            totalExams: user?._count.examsCreated || 0,
            totalAttempts,
            activeExams: exams.filter(e => e.isPublished).length,
            pendingGrading,
            recentCreated: exams.slice(0, 3).map(e => ({
                id: e.id,
                title: e.title,
                attempts: e._count.attempts,
                date: e.createdAt,
            })),
        };
    }
    async getAdminStats() {
        const [totalUsers, totalExams, pendingApprovals, activeNow] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.exam.count(),
            this.prisma.user.count({ where: { status: 'PENDING' } }),
            this.prisma.examAttempt.count({ where: { status: client_1.AttemptStatus.STARTED } }),
        ]);
        const recentUsers = await this.prisma.user.findMany({
            where: { status: 'PENDING' },
            take: 3,
            orderBy: { createdAt: 'desc' },
        });
        return {
            totalUsers,
            activeExams: totalExams,
            pendingApprovals,
            activeNow,
            recentApprovals: recentUsers.map(u => ({
                id: u.id,
                name: u.name,
                role: u.role,
                date: u.createdAt,
            })),
        };
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map