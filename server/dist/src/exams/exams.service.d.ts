import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        instructor: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
    })[]>;
    findOne(id: string): Promise<{
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            examId: string;
            type: import("@prisma/client").$Enums.QuestionType;
            content: string;
            options: Prisma.JsonValue | null;
            answer: string;
            points: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
    }>;
    create(data: Prisma.ExamCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
    }>;
    update(id: string, data: Prisma.ExamUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
    }>;
    startAttempt(userId: string, examId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        userId: string;
    }>;
    submitAttempt(attemptId: string, answers: {
        questionId: string;
        response: string;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        userId: string;
    }>;
    generateResultPdf(attemptId: string, res: any): Promise<void>;
    getResults(userId: string): Promise<({
        exam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            duration: number;
            startTime: Date | null;
            endTime: Date | null;
            isPublished: boolean;
            randomized: boolean;
            passPercentage: number;
            instructorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        userId: string;
    })[]>;
}
