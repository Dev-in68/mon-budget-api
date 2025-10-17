import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findMe should return user if found', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a', name: 'b' });
    const result = await service.findMe(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(result).toEqual({ id: 1, email: 'a', name: 'b' });
  });

  it('findMe should throw if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findMe(1)).rejects.toThrow(NotFoundException);
  });

  it('findMe should throw if id is invalid', async () => {
    await expect(service.findMe(undefined as any)).rejects.toThrow(NotFoundException);
  });
});
