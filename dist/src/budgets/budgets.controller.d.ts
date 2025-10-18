import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
export declare class BudgetsController {
    private readonly budgets;
    constructor(budgets: BudgetsService);
    list(req: any, year: string, month: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        month: number;
        limit: import("@prisma/client/runtime/library").Decimal;
        userId: number;
    }[]>;
    create(req: any, dto: CreateBudgetDto): import(".prisma/client").Prisma.Prisma__BudgetClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        month: number;
        limit: import("@prisma/client/runtime/library").Decimal;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
