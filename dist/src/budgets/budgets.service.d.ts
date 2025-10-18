import { PrismaService } from '../prisma/prisma.service';
export declare class BudgetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: number, year: number, month: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        month: number;
        limit: import("@prisma/client/runtime/library").Decimal;
        userId: number;
    }[]>;
    create(userId: number, data: {
        year: number;
        month: number;
        limit: number;
    }): import(".prisma/client").Prisma.Prisma__BudgetClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        month: number;
        limit: import("@prisma/client/runtime/library").Decimal;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
