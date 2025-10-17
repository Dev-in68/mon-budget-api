import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: number, from?: Date, to?: Date): any;
    create(userId: number, dto: CreateTransactionDto): any;
    delete(userId: number, id: number): Promise<any>;
}
