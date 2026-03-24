import { ExamsService } from './exams.service';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    findAll(req: any): Promise<({
        _count: {
            questions: number;
        };
        instructor: {
            name: string;
        };
    } & {
        id: string;
        faculty: string | null;
        department: string | null;
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
    findMyExams(req: any): Promise<({
        _count: {
            questions: number;
            attempts: number;
        };
    } & {
        id: string;
        faculty: string | null;
        department: string | null;
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
        faculty: string | null;
        department: string | null;
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
    create(createExamDto: Prisma.ExamCreateInput, req: any): Promise<{
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
        faculty: string | null;
        department: string | null;
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
    update(id: string, updateExamDto: any): Promise<{
        id: string;
        faculty: string | null;
        department: string | null;
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
    remove(id: string): Promise<{
        id: string;
        faculty: string | null;
        department: string | null;
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
    startAttempt(req: any, id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    }>;
    submitAttempt(id: string, answers: any[]): Promise<({
        exam: {
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
            faculty: string | null;
            department: string | null;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    }) | ({
        user: {
            id: string;
            email: string;
            phoneNumber: string | null;
            name: string;
            password: string | null;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.UserStatus;
            registrationNumber: string | null;
            staffId: string | null;
            faculty: string | null;
            department: string | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        exam: {
            id: string;
            faculty: string | null;
            department: string | null;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    })>;
    getResults(req: any): Promise<({
        exam: {
            id: string;
            faculty: string | null;
            department: string | null;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    })[]>;
    getStats(req: any): Promise<{
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
    } | {
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
    getAttemptDetails(id: string): Promise<{
        exam: {
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
            faculty: string | null;
            department: string | null;
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
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    }>;
    downloadPdf(id: string, res: Response): Promise<void>;
    getAttempts(id: string): Promise<({
        user: {
            email: string;
            name: string;
            registrationNumber: string | null;
            staffId: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    })[]>;
    gradeAttempt(id: string, grades: any[]): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        submitTime: Date | null;
        score: number;
        examId: string;
        userId: string;
    }>;
}
