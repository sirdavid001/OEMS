import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(createQuestionDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: import("@prisma/client/runtime/client").JsonValue | null;
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
        options: import("@prisma/client/runtime/client").JsonValue | null;
        answer: string;
        points: number;
    }[]>;
    update(id: string, updateQuestionDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        answer: string;
        points: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        content: string;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        answer: string;
        points: number;
    }>;
}
