// src/budgets/budgets.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: number, year: number, month: number) {
    return this.prisma.budget.findMany({
      where: { userId, year, month },
      orderBy: { month: 'asc' }, // ou { createdAt: 'desc' } selon ton besoin
    });
  }

  create(userId: number, data: { year: number; month: number; limit: number }) {
    return this.prisma.budget.create({
      data: { ...data, userId },
    });
  }
}
