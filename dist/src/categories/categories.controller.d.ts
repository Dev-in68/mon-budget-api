import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private categories;
    constructor(categories: CategoriesService);
    list(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }[]>;
    create(req: any, dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(req: any, id: number): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
