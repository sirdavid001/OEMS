import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ExamsService } from '../exams.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeSessions = new Map<string, { timeLeft: number; timer: NodeJS.Timeout }>();

  constructor(private readonly examsService: ExamsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinExam')
  async handleJoinExam(
    @MessageBody() data: { examId: string; attemptId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { examId, attemptId } = data;
    client.join(`exam_${examId}`);
    client.join(`attempt_${attemptId}`);
    
    // Initialize or sync timer
    const exam = await this.examsService.findOne(examId);
    if (!this.activeSessions.has(attemptId)) {
      this.startTimer(attemptId, exam.duration * 60);
    }
    
    const session = this.activeSessions.get(attemptId);
    if (session) {
      client.emit('timerSync', { timeLeft: session.timeLeft });
    }
  }

  @SubscribeMessage('cheatAlert')
  handleCheatAlert(
    @MessageBody() data: { attemptId: string; type: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.warn(`Cheat alert: ${data.type} for attempt ${data.attemptId}`);
    // Log to DB or notify instructor
    this.server.to(`attempt_${data.attemptId}`).emit('proctoringAlert', {
      message: `System alert: ${data.type} detected.`,
    });
  }

  private startTimer(attemptId: string, durationSeconds: number) {
    const timer = setInterval(() => {
      const session = this.activeSessions.get(attemptId);
      if (session) {
        session.timeLeft -= 1;
        session.timeLeft -= 1;
        if (session.timeLeft <= 0) {
          this.stopTimer(attemptId);
          this.server.to(`attempt_${attemptId}`).emit('examFinished', {
            message: 'Time is up! Your exam has been submitted.',
          });
          // Call submit service logic here
        } else {
          // Periodically sync
          if (session.timeLeft % 10 === 0) {
            this.server.to(`attempt_${attemptId}`).emit('timerSync', {
              timeLeft: session.timeLeft,
            });
          }
        }
      }
    }, 1000);

    this.activeSessions.set(attemptId, { timeLeft: durationSeconds, timer });
  }

  private stopTimer(attemptId: string) {
    const session = this.activeSessions.get(attemptId);
    if (session) {
      clearInterval(session.timer);
      this.activeSessions.delete(attemptId);
    }
  }
}
