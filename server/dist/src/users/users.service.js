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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
const authUserSelect = {
    id: true,
    email: true,
    phoneNumber: true,
    name: true,
    password: true,
    role: true,
    status: true,
    registrationNumber: true,
    staffId: true,
    faculty: true,
    department: true,
    createdAt: true,
    updatedAt: true,
};
let UsersService = class UsersService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            select: authUserSelect,
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: authUserSelect,
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data: {
                ...data,
                password: '',
            },
            select: authUserSelect,
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.password && typeof data.password === 'string' && data.password !== '') {
            const bcrypt = require('bcrypt');
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: authUserSelect,
        });
    }
    generateRandomPassword(length = 10) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    async updateStatus(id, status, approver) {
        const target = await this.findById(id);
        if (!target)
            throw new Error('User not found');
        let canApprove = false;
        if (approver.role === 'ADMIN') {
            canApprove = true;
        }
        else if (approver.role === 'DEAN') {
            if ((target.role === client_1.Role.HOD || target.role === client_1.Role.STUDENT || target.role === client_1.Role.LECTURER) && target.faculty === approver.faculty) {
                canApprove = true;
            }
        }
        else if (approver.role === 'HOD') {
            if (target.role === 'STUDENT' && target.department === approver.department) {
                canApprove = true;
            }
        }
        if (!canApprove) {
            throw new Error('You do not have permission to approve this user based on your role and faculty/department.');
        }
        let password = '';
        let updateData = { status };
        if (status === 'APPROVED') {
            password = this.generateRandomPassword();
            const bcrypt = require('bcrypt');
            updateData.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: authUserSelect,
        });
        if (status === 'APPROVED') {
            const identifier = updatedUser.role === 'STUDENT' ? updatedUser.registrationNumber : updatedUser.staffId;
            await this.mailService.sendCredentials(updatedUser.email, updatedUser.name, password, identifier || updatedUser.email);
        }
        return updatedUser;
    }
    async getManagedUsers(approver) {
        const where = {
            status: { not: 'PENDING' },
        };
        if (approver.role === 'ADMIN') {
        }
        else if (approver.role === 'DEAN') {
            where.faculty = approver.faculty;
            where.role = { in: [client_1.Role.HOD, client_1.Role.STUDENT, client_1.Role.LECTURER] };
        }
        else if (approver.role === 'HOD') {
            where.department = approver.department;
            where.role = 'STUDENT';
        }
        else {
            return [];
        }
        return this.prisma.user.findMany({
            where,
            select: authUserSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPendingApprovals(approver) {
        const where = {
            status: 'PENDING',
        };
        if (approver.role === 'ADMIN') {
        }
        else if (approver.role === 'DEAN') {
            where.faculty = approver.faculty;
            where.role = { in: [client_1.Role.HOD, client_1.Role.STUDENT, client_1.Role.LECTURER] };
        }
        else if (approver.role === 'HOD') {
            where.department = approver.department;
            where.role = 'STUDENT';
        }
        else {
            return [];
        }
        return this.prisma.user.findMany({
            where,
            select: authUserSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map