import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private tx;
    constructor(tx: TransactionsService);
    list(req: any, year?: string, month?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    create(req: any, dto: CreateTransactionDto): import(".prisma/client").Prisma.Prisma__TransactionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        categoryId: number;
        note: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    del(req: any, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
