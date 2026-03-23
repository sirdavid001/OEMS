import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Question, Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuestionCreateInput) {
    return this.prisma.question.create({ data });
  }

  async update(id: string, data: Prisma.QuestionUpdateInput) {
    return this.prisma.question.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }

  async findByExam(examId: string) {
    return this.prisma.question.findMany({ where: { examId } });
  }
}
