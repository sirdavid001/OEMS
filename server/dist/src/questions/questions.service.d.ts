import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.QuestionCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: Prisma.JsonValue | null;
        answer: string;
        points: number;
    }>;
    update(id: string, data: Prisma.QuestionUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: Prisma.JsonValue | null;
        answer: string;
        points: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: Prisma.JsonValue | null;
        answer: string;
        points: number;
    }>;
    findByExam(examId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: Prisma.JsonValue | null;
        answer: string;
        points: number;
    }[]>;
}
