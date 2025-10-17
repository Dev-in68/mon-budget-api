import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private tx;
    constructor(tx: TransactionsService);
    list(req: any, year?: string, month?: string): any;
    create(req: any, dto: CreateTransactionDto): any;
    del(req: any, id: number): Promise<any>;
}
