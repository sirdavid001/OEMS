import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';
declare const authUserSelect: {
    id: true;
    email: true;
    phoneNumber: true;
    name: true;
    password: true;
    role: true;
    status: true;
    registrationNumber: true;
    staffId: true;
    faculty: true;
    department: true;
    createdAt: true;
    updatedAt: true;
};
type AuthUserRecord = Prisma.UserGetPayload<{
    select: typeof authUserSelect;
}>;
export declare class UsersService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    findByEmail(email: string): Promise<AuthUserRecord | null>;
    findById(id: string): Promise<AuthUserRecord | null>;
    create(data: Prisma.UserCreateInput): Promise<AuthUserRecord>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<AuthUserRecord>;
    private generateRandomPassword;
    updateStatus(id: string, status: 'APPROVED' | 'REJECTED', approver: AuthUserRecord): Promise<AuthUserRecord>;
    getPendingApprovals(approver: AuthUserRecord): Promise<AuthUserRecord[]>;
}
export {};
