import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExamsService } from '../exams.service';
export declare class ExamGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly examsService;
    server: Server;
    private activeSessions;
    constructor(examsService: ExamsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinExam(data: {
        examId: string;
        attemptId: string;
    }, client: Socket): Promise<void>;
    handleCheatAlert(data: {
        attemptId: string;
        type: string;
    }, client: Socket): void;
    private startTimer;
    private stopTimer;
}
