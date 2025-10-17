import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list should call prisma.category.findMany', async () => {
    prisma.category.findMany.mockResolvedValue([{ id: 1 }]);
    const result = await service.list(1);
    expect(prisma.category.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('create should call prisma.category.create', async () => {
    prisma.category.create.mockResolvedValue({ id: 1 });
    const dto = { name: 'test', type: 'INCOME' };
    const result = await service.create(1, dto);
    expect(prisma.category.create).toHaveBeenCalledWith({ data: { ...dto, userId: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  it('remove should call prisma.category.delete', async () => {
    prisma.category.delete.mockResolvedValue({ id: 1 });
    const result = await service.remove(1, 1);
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });
});
