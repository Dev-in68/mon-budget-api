import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { BadRequestException } from '@nestjs/common';

describe('BudgetsController', () => {
  let controller: BudgetsController;
  let service: BudgetsService;

  beforeEach(async () => {
    const mockService = {
      list: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: 1 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [
        { provide: BudgetsService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<BudgetsController>(BudgetsController);
    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('list should throw BadRequestException for invalid params', () => {
    expect(() => controller.list({ user: { sub: 1 } }, '2025', '13')).toThrow(BadRequestException);
    expect(() => controller.list({ user: { sub: 1 } }, 'abc', '10')).toThrow(BadRequestException);
  });

  it('list should call service.list with valid params', () => {
    controller.list({ user: { sub: 1 } }, '2025', '10');
    expect(service.list).toHaveBeenCalledWith(1, 2025, 10);
  });

  it('create should call service.create', () => {
    const dto: CreateBudgetDto = { name: 'test', amount: 100 } as any;
    controller.create({ user: { sub: 1 } }, dto);
    expect(service.create).toHaveBeenCalledWith(1, dto);
  });
});
