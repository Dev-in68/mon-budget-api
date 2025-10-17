import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private categories;
    constructor(categories: CategoriesService);
    list(req: any): any;
    create(req: any, dto: CreateCategoryDto): any;
    remove(req: any, id: number): any;
}
