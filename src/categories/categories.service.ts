import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  list(userId: number) {
    return this.prisma.category.findMany({ where: { userId } });
  }
  create(userId: number, dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...dto, userId } });
  }
  remove(userId: number, id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
