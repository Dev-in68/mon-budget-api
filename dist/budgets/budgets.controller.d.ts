import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
export declare class BudgetsController {
    private readonly budgets;
    constructor(budgets: BudgetsService);
    list(req: any, year: string, month: string): any;
    create(req: any, dto: CreateBudgetDto): any;
}
