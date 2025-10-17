import { PrismaService } from '../prisma/prisma.service';
export declare class BudgetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: number, year: number, month: number): any;
    create(userId: number, data: {
        year: number;
        month: number;
        limit: number;
    }): any;
}
