import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }[]>;
    create(userId: number, dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(userId: number, id: number): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
