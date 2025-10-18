import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: number, from?: Date, to?: Date): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            type: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        categoryId: number;
        note: string | null;
    })[]>;
    create(userId: number, dto: CreateTransactionDto): import(".prisma/client").Prisma.Prisma__TransactionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        categoryId: number;
        note: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(userId: number, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
