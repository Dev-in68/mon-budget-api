import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly cfg;
    constructor(prisma: PrismaService, jwt: JwtService, cfg: ConfigService);
    register(dto: {
        email: string;
        name: string;
        password: string;
    }): Promise<{
        access: string;
        refresh: string;
    }>;
    login(email: string, password: string): Promise<{
        access: string;
        refresh: string;
    }>;
    private tokens;
}
