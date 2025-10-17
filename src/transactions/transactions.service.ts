import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  list(userId: number, from?: Date, to?: Date) {
    return this.prisma.transaction.findMany({
      where: { userId, ...(from && to ? { date: { gte: from, lt: to } } : {}) },
      include: { category: true },
    });
  }
  create(userId: number, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: { ...dto, date: new Date(dto.date), userId },
    });
  }
  // Variante sûre : deleteMany avec double filtre
  async delete(userId: number, id: number) {
    const res = await this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
    // optionnel: vérifier qu’on a bien supprimé quelque chose
    if (res.count === 0) {
      // throw new NotFoundException('Transaction introuvable');
    }
    return res;
  }
}
