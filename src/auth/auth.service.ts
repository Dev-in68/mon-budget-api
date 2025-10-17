import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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

    if (!user.password)
      throw new UnauthorizedException('Identifiants invalides');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    return this.tokens(user.id, user.email);
  }

  private async tokens(
    sub: number | string,
    email: string,
  ): Promise<{ access: string; refresh: string }> {
    const payload: JwtPayload = { sub, email };

    const jwtSecret = this.cfg.get<string>('JWT_SECRET');
    if (!jwtSecret)
      throw new InternalServerErrorException('JWT_SECRET non configuré');

    const accessExpires = this.cfg.get<string | number>('JWT_EXPIRES') ?? '15m';
    const refreshExpires =
      this.cfg.get<string | number>('JWT_REFRESH_EXPIRES') ??
      this.cfg.get<string | number>('JWT_EXPIRES') ??
      '7d';

    const access = await this.jwt.signAsync(
      payload as any,
      {
        secret: jwtSecret,
        expiresIn: accessExpires,
      } as any,
    );

    const refreshSecret =
      this.cfg.get<string>('JWT_REFRESH_SECRET') ?? jwtSecret;

    const refresh = await this.jwt.signAsync(
      payload as any,
      {
        secret: refreshSecret,
        expiresIn: refreshExpires,
      } as any,
    );

    return { access, refresh };
  }
}
