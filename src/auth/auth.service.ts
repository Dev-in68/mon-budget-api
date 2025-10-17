function parseExpires(val: unknown, fallback: string | number) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && /^\d+[smhd]?$/.test(val)) return val;
  return fallback;
}
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// JWT payload uses `sub` which can be number or string depending on JWT creation
type JwtPayload = { sub: number | string; email: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: { email: string; name: string; password: string }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Email déjà utilisé');

    const saltRounds =
      this.cfg.get<number>('BCRYPT_SALT_ROUNDS') !== undefined
        ? Number(this.cfg.get<number>('BCRYPT_SALT_ROUNDS'))
        : 10;

    const hashed = await bcrypt.hash(dto.password, saltRounds);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, password: hashed },
      select: { id: true, email: true },
    });

    return this.tokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    if (!user.password) throw new UnauthorizedException('Identifiants invalides');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    return this.tokens(user.id, user.email);
  }

  private async tokens(sub: number | string, email: string) {
    const payload: JwtPayload = { sub, email };

    const jwtSecret = this.cfg.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new InternalServerErrorException('JWT_SECRET non configuré');

    const accessExpires = parseExpires(this.cfg.get('JWT_EXPIRES'), '15m');
    const refreshExpires = parseExpires(
      this.cfg.get('JWT_REFRESH_EXPIRES'),
      this.cfg.get('JWT_EXPIRES') ?? '7d'
    );

    const access = await this.jwt.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: accessExpires as any,
    });

    const refreshSecret = this.cfg.get<string>('JWT_REFRESH_SECRET') ?? jwtSecret;

    const refresh = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpires as any,
    });

    return { access, refresh };
  }
}
