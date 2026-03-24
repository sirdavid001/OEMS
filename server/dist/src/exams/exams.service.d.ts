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
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            content: string;
            options: Prisma.JsonValue | null;
            answer: string;
            points: number;
            examId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: Prisma.ExamCreateInput): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.ExamUpdateInput): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        startTime: Date | null;
        endTime: Date | null;
        isPublished: boolean;
        randomized: boolean;
        passPercentage: number;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    startAttempt(userId: string, examId: string): Promise<{
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        userId: string;
    }>;
    submitAttempt(attemptId: string, answers: {
        questionId: string;
        response: string;
    }[]): Promise<{
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        userId: string;
    }>;
    generateResultPdf(attemptId: string, res: any): Promise<void>;
    getResults(userId: string): Promise<({
        exam: {
            id: string;
            title: string;
            description: string | null;
            duration: number;
            startTime: Date | null;
            endTime: Date | null;
            isPublished: boolean;
            randomized: boolean;
            passPercentage: number;
            instructorId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        userId: string;
    })[]>;
    getStudentStats(userId: string): Promise<{
        totalExams: number;
        completedExams: number;
        averageScore: number;
        hoursSpent: string;
        recentAttempts: {
            id: string;
            examTitle: string;
            score: number;
            date: Date | null;
        }[];
    }>;
    getAttemptDetails(attemptId: string): Promise<{
        exam: {
            questions: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                content: string;
                options: Prisma.JsonValue | null;
                answer: string;
                points: number;
                examId: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string | null;
            duration: number;
            startTime: Date | null;
            endTime: Date | null;
            isPublished: boolean;
            randomized: boolean;
            passPercentage: number;
            instructorId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        answers: {
            id: string;
            response: string;
            pointsEarned: number;
            feedback: string | null;
            attemptId: string;
            questionId: string;
        }[];
    } & {
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        submitTime: Date | null;
        score: number;
        status: import("@prisma/client").$Enums.AttemptStatus;
        userId: string;
    }>;
}
