import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<({
        instructor: {
            name: string;
        };
        _count: {
            questions: number;
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
        faculty: string | null;
        department: string | null;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findMyExams(instructorId: string): Promise<({
        _count: {
            questions: number;
            attempts: number;
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
        faculty: string | null;
        department: string | null;
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
        faculty: string | null;
        department: string | null;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: any): Promise<{
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
        faculty: string | null;
        department: string | null;
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
        faculty: string | null;
        department: string | null;
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
        faculty: string | null;
        department: string | null;
        instructorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    startAttempt(userId: string, examId: string): Promise<{
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        submitTime: Date | null;
        score: number;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        submitTime: Date | null;
        score: number;
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
            faculty: string | null;
            department: string | null;
            instructorId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        startTime: Date;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        submitTime: Date | null;
        score: number;
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
            faculty: string | null;
            department: string | null;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        examId: string;
        submitTime: Date | null;
        score: number;
        userId: string;
    }>;
    getInstructorStats(userId: string): Promise<{
        totalExams: number;
        totalAttempts: number;
        activeExams: number;
        recentCreated: {
            id: string;
            title: string;
            attempts: number;
            date: Date;
        }[];
    }>;
}
