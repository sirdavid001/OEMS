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
const authUserSelect = {
    id: true,
    email: true,
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
    constructor(prisma) {
        this.prisma = prisma;
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
            data,
            select: authUserSelect,
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.password && typeof data.password === 'string') {
            const bcrypt = require('bcrypt');
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: authUserSelect,
        });
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
            if ((target.role === 'HOD' || target.role === 'STUDENT' || target.role === 'INSTRUCTOR') && target.faculty === approver.faculty) {
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
        return this.prisma.user.update({
            where: { id },
            data: { status },
            select: authUserSelect,
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
            where.role = { in: ['HOD', 'STUDENT', 'INSTRUCTOR'] };
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map