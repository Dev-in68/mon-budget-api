import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: number, year: number, month: number) {
    return this.prisma.budget.findMany({
      where: { userId, year, month },
      orderBy: { id: 'asc' },
    });
  }

  async create(userId: number, dto: CreateBudgetDto) {
    const { year, month, limit } = dto;
    return this.prisma.budget.create({
      data: { userId, year, month, limit },
    });
  }
}
