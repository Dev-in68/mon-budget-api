import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: { budget: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      budget: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list should call prisma.budget.findMany', async () => {
    await service.list(1, 2025, 10);
    expect(prisma.budget.findMany).toHaveBeenCalled();
  });
});
