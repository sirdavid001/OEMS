import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';
export declare class ExamsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    findAll(user: any): Promise<({
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
    findMyExams(instructorId: string): Promise<({
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
    create(data: any): Promise<{
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
    update(id: string, data: Prisma.ExamUpdateInput): Promise<{
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
    delete(id: string): Promise<{
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
    startAttempt(userId: string, examId: string): Promise<{
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
    submitAttempt(attemptId: string, answers: {
        questionId: string;
        response: string;
    }[]): Promise<({
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
    generateResultPdf(attemptId: string, res: any): Promise<void>;
    getResults(userId: string): Promise<({
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
    getStudentStats(userId: string): Promise<{
        totalExams: number;
        completedExams: number;
        averageScore: number;
        hoursSpent: string;
        recentAttempts: {
            id: string;
            examTitle: string;
            score: number;
            date: Date;
        }[];
        upcomingExams: {
            id: string;
            title: string;
            date: Date | null;
            duration: number;
        }[];
    }>;
    getAttemptDetails(attemptId: string): Promise<{
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
    getExamAttempts(examId: string): Promise<({
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
    gradeAttempt(attemptId: string, grades: {
        questionId: string;
        points: number;
        feedback?: string;
    }[]): Promise<{
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
