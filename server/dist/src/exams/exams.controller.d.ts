import { ExamsService } from './exams.service';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
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
    create(createExamDto: Prisma.ExamCreateInput, req: any): Promise<{
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
    update(id: string, updateExamDto: any): Promise<{
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
    remove(id: string): Promise<{
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
    startAttempt(req: any, id: string): Promise<{
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
    submitAttempt(id: string, answers: any[]): Promise<{
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
    getResults(req: any): Promise<({
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
    downloadPdf(id: string, res: Response): Promise<void>;
}
