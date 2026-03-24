import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
declare const authUserSelect: {
    id: true;
    email: true;
    name: true;
    password: true;
    role: true;
    createdAt: true;
    updatedAt: true;
};
type AuthUserRecord = Prisma.UserGetPayload<{
    select: typeof authUserSelect;
}>;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<AuthUserRecord | null>;
    findById(id: string): Promise<AuthUserRecord | null>;
    create(data: Prisma.UserCreateInput): Promise<AuthUserRecord>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<AuthUserRecord>;
}
export {};
