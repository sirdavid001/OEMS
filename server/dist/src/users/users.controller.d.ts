import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        registrationNumber: string | null;
        staffId: string | null;
        faculty: string | null;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPending(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        registrationNumber: string | null;
        staffId: string | null;
        faculty: string | null;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateStatus(req: any, id: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        registrationNumber: string | null;
        staffId: string | null;
        faculty: string | null;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
