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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    
    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException('Your account is pending approval by the Dean or HOD.');
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
      },
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Default status for new users is PENDING, except ADMIN (if created via this endpoint, though usually not)
    const status = data.role === 'ADMIN' ? 'APPROVED' : 'PENDING';

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      status: status,
      registrationNumber: data.registrationNumber,
      staffId: data.staffId,
      faculty: data.faculty,
      department: data.department,
    });

    if (user.status === 'PENDING') {
      return { 
        message: 'Registration successful. Your account is pending approval by the Dean or HOD.',
        user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status }
      };
    }
    
    return this.login(user);
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
