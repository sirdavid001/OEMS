"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(identifier, pass) {
        const bootstrapEmail = process.env.ADMIN_EMAIL;
        const bootstrapPassword = process.env.ADMIN_PASSWORD;
        if (bootstrapEmail && bootstrapPassword && identifier === bootstrapEmail && pass === bootstrapPassword) {
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
        if (!user)
            return null;
        if (user.status !== 'APPROVED') {
            throw new common_1.UnauthorizedException('Your account is pending approval by the Dean or HOD.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Account not yet finalized. Please check your email for credentials.');
        }
        if (await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
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
    async register(data) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phoneNumber: data.phoneNumber },
                ]
            }
        });
        if (existing) {
            throw new common_1.ConflictException('Email or Phone Number already exists');
        }
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
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpires = new Date(Date.now() + 3600000);
        await this.usersService.update(user.id, {
            resetToken,
            resetTokenExpires,
        });
        console.log(`Password reset link: http://localhost:5173/reset-password?token=${resetToken}`);
        return { message: 'If an account exists, a reset link has been sent.' };
    }
    async resetPassword(data) {
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
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null,
        });
        return { message: 'Password reset successful' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map