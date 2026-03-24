import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(identifier: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            phoneNumber: any;
            registrationNumber: any;
            staffId: any;
        };
    }>;
    register(data: any): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.UserStatus;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(data: any): Promise<{
        message: string;
    }>;
}
