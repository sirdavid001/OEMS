import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

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
} satisfies Prisma.UserSelect;

type AuthUserRecord = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    });
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: authUserSelect,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<AuthUserRecord> {
    return this.prisma.user.create({
      data,
      select: authUserSelect,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<AuthUserRecord> {
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

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', approver: AuthUserRecord): Promise<AuthUserRecord> {
    const target = await this.findById(id);
    if (!target) throw new Error('User not found');

    // Hierarchy Logic
    let canApprove = false;
    
    if (approver.role === 'ADMIN') {
      canApprove = true;
    } else if (approver.role === 'DEAN') {
      // Dean can approve HOD and Student in same faculty
      if ((target.role === 'HOD' || target.role === 'STUDENT' || target.role === 'INSTRUCTOR') && target.faculty === approver.faculty) {
        canApprove = true;
      }
    } else if (approver.role === 'HOD') {
      // HOD can approve Student in same department
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

  async getPendingApprovals(approver: AuthUserRecord): Promise<AuthUserRecord[]> {
    const where: Prisma.UserWhereInput = {
      status: 'PENDING',
    };

    if (approver.role === 'ADMIN') {
      // Admin sees all
    } else if (approver.role === 'DEAN') {
      // Dean sees HODs, Students, Instructors in their faculty
      where.faculty = approver.faculty;
      where.role = { in: ['HOD', 'STUDENT', 'INSTRUCTOR'] };
    } else if (approver.role === 'HOD') {
      // HOD sees Students in their department
      where.department = approver.department;
      where.role = 'STUDENT';
    } else {
      // Regular users see nothing
      return [];
    }

    return this.prisma.user.findMany({
      where,
      select: authUserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }
}
