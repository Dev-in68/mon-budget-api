import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let config: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwt = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };
    config = {
      get: jest.fn((key: string) => {
        if (key === 'BCRYPT_SALT_ROUNDS') return 10;
        if (key === 'JWT_SECRET') return 'jwt-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'jwt-refresh-secret';
        if (key === 'JWT_EXPIRES') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES') return '7d';
        return undefined;
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register should throw if email exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    await expect(service.register({ email: 'a', name: 'b', password: 'c' }))
      .rejects.toThrow(ConflictException);
  });

  it('register should hash password and create user, then return tokens', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prisma.user.create.mockResolvedValue({ id: 1, email: 'a' });
    const result = await service.register({ email: 'a', name: 'b', password: 'c' });
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'a', name: 'b', password: 'hashed' },
      select: { id: true, email: true },
    });
    expect(result).toEqual({ access: 'signed-token', refresh: 'signed-token' });
  });

  it('login should throw if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login('a', 'pw')).rejects.toThrow(UnauthorizedException);
  });

  it('login should throw if password is missing', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a' });
    await expect(service.login('a', 'pw')).rejects.toThrow(UnauthorizedException);
  });

  it('login should throw if password does not match', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a', password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(service.login('a', 'pw')).rejects.toThrow(UnauthorizedException);
  });

  it('login should return tokens if password matches', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a', password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.login('a', 'pw');
    expect(result).toEqual({ access: 'signed-token', refresh: 'signed-token' });
  });

  it('should throw if JWT_SECRET is missing', async () => {
    config.get = jest.fn((key: string) => (key === 'JWT_SECRET' ? undefined : 'x'));
    prisma.user.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prisma.user.create.mockResolvedValue({ id: 1, email: 'a' });
    await expect(service.register({ email: 'a', name: 'b', password: 'c' }))
      .rejects.toThrow(InternalServerErrorException);
  });
});
