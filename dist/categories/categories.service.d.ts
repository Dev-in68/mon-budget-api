import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: number): any;
    create(userId: number, dto: CreateCategoryDto): any;
    remove(userId: number, id: number): any;
}
