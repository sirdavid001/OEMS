import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    // 1. Check for Bootstrap Admin (from .env)
    const bootstrapEmail = process.env.ADMIN_EMAIL;
    const bootstrapPassword = process.env.ADMIN_PASSWORD;

    if (bootstrapEmail && bootstrapPassword && identifier === bootstrapEmail && pass === bootstrapPassword) {
      // Ensure the admin user exists in DB with these credentials
      let admin = await this.prisma.user.findUnique({ where: { email: bootstrapEmail } });
      
      if (!admin) {
        const hashedPassword = await bcrypt.hash(bootstrapPassword, 10);
        admin = await this.prisma.user.create({
          data: {
            email: bootstrapEmail,
            name: 'System Administrator',
            password: hashedPassword,
            role: 'ADMIN',
            status: 'APPROVED',
            staffId: 'ADMIN-001',
          },
        });
      }
      
      const { password, ...result } = admin;
      return result;
    }

    // 2. Normal DB Check
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier },
          { registrationNumber: identifier },
          { staffId: identifier },
        ],
      },
    });

    if (!user) return null;
    
    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException('Your account is pending approval by the Dean or HOD.');
    }

    if (!user.password) {
      throw new UnauthorizedException('Account not yet finalized. Please check your email for credentials.');
    }

    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        registrationNumber: user.registrationNumber,
        staffId: user.staffId,
      },
    };
  }

  async register(data: any) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phoneNumber: data.phoneNumber },
        ]
      }
    });
    
    if (existing) {
      throw new ConflictException('Email or Phone Number already exists');
    }

    // Default status for new users is PENDING, except ADMIN
    const status = data.role === 'ADMIN' ? 'APPROVED' : 'PENDING';

    const user = await this.usersService.create({
      email: data.email,
      phoneNumber: data.phoneNumber,
      name: data.name,
      role: data.role,
      status: status,
      registrationNumber: data.role === 'STUDENT' ? data.registrationNumber : null,
      staffId: data.role === 'LECTURER' ? data.staffId : null,
      faculty: data.faculty,
      department: data.department,
    });

    return { 
      message: 'Registration successful. Your account is pending approval by the Dean or HOD. You will receive your login credentials via email once approved.',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status }
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // In a real app, send email here. Logging for now.
    console.log(`Password reset link: http://localhost:5173/reset-password?token=${resetToken}`);

    return { message: 'If an account exists, a reset link has been sent.' };
  }

  async resetPassword(data: any) {
    const { token, newPassword } = data;
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    return { message: 'Password reset successful' };
  }
}
