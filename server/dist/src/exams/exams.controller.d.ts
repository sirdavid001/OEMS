import { ExamsService } from './exams.service';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
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
    create(createExamDto: Prisma.ExamCreateInput, req: any): Promise<{
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
    update(id: string, updateExamDto: any): Promise<{
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
    remove(id: string): Promise<{
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
    startAttempt(req: any, id: string): Promise<{
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
    submitAttempt(id: string, answers: any[]): Promise<{
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
    getResults(req: any): Promise<({
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
    downloadPdf(id: string, res: Response): Promise<void>;
}
