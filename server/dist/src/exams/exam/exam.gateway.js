"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const exams_service_1 = require("../exams.service");
let ExamGateway = class ExamGateway {
    examsService;
    server;
    activeSessions = new Map();
    constructor(examsService) {
        this.examsService = examsService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinExam(data, client) {
        const { examId, attemptId } = data;
        client.join(`exam_${examId}`);
        client.join(`attempt_${attemptId}`);
        const exam = await this.examsService.findOne(examId);
        if (!this.activeSessions.has(attemptId)) {
            this.startTimer(attemptId, exam.duration * 60);
        }
        const session = this.activeSessions.get(attemptId);
        if (session) {
            client.emit('timerSync', { timeLeft: session.timeLeft });
        }
    }
    handleCheatAlert(data, client) {
        console.warn(`Cheat alert: ${data.type} for attempt ${data.attemptId}`);
        this.server.to(`attempt_${data.attemptId}`).emit('proctoringAlert', {
            message: `System alert: ${data.type} detected.`,
        });
    }
    startTimer(attemptId, durationSeconds) {
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
                }
                else {
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
    stopTimer(attemptId) {
        const session = this.activeSessions.get(attemptId);
        if (session) {
            clearInterval(session.timer);
            this.activeSessions.delete(attemptId);
        }
    }
};
exports.ExamGateway = ExamGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ExamGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinExam'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ExamGateway.prototype, "handleJoinExam", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cheatAlert'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ExamGateway.prototype, "handleCheatAlert", null);
exports.ExamGateway = ExamGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamGateway);
//# sourceMappingURL=exam.gateway.js.map