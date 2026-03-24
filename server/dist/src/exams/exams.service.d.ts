import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';
export declare class ExamsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
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
    }[]): Promise<({
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
    }) | ({
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
        user: {
            id: string;
            faculty: string | null;
            department: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phoneNumber: string | null;
            name: string;
            password: string | null;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.UserStatus;
            registrationNumber: string | null;
            staffId: string | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
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
    })>;
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
    getExamAttempts(examId: string): Promise<({
        user: {
            email: string;
            name: string;
            registrationNumber: string | null;
            staffId: string | null;
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
    gradeAttempt(attemptId: string, grades: {
        questionId: string;
        points: number;
        feedback?: string;
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
    getLecturerStats(userId: string): Promise<{
        totalExams: number;
        totalAttempts: number;
        activeExams: number;
        pendingGrading: number;
        recentCreated: {
            id: string;
            title: string;
            attempts: number;
            date: Date;
        }[];
    }>;
    getAdminStats(): Promise<{
        totalUsers: number;
        activeExams: number;
        pendingApprovals: number;
        activeNow: number;
        recentApprovals: {
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            date: Date;
        }[];
    }>;
}
