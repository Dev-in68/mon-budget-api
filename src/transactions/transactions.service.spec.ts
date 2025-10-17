import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      transaction: {
        findMany: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list should call prisma.transaction.findMany', async () => {
    prisma.transaction.findMany.mockResolvedValue([{ id: 1 }]);
    const result = await service.list(1);
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: { category: true },
    });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('create should call prisma.transaction.create', async () => {
    prisma.transaction.create.mockResolvedValue({ id: 1 });
    const dto = { amount: 100, date: '2025-10-17', categoryId: 2 };
    const result = await service.create(1, dto);
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: { ...dto, date: new Date(dto.date), userId: 1 },
    });
    expect(result).toEqual({ id: 1 });
  });

  it('delete should call prisma.transaction.deleteMany and return result', async () => {
    prisma.transaction.deleteMany.mockResolvedValue({ count: 1 });
    const result = await service.delete(1, 2);
    expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({ where: { id: 2, userId: 1 } });
    expect(result).toEqual({ count: 1 });
  });

  it('delete should return {count: 0} if nothing deleted', async () => {
    prisma.transaction.deleteMany.mockResolvedValue({ count: 0 });
    const result = await service.delete(1, 2);
    expect(result).toEqual({ count: 0 });
  });
});
