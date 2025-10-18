import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private categories: CategoriesService) {}
  @Get() list(@Req() req: any) {
    return this.categories.list(req.user.sub);
  }
  @Post() create(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.categories.create(req.user.sub, dto);
  }
  @Delete(':id') remove(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categories.remove(req.user.sub, id);
  }
}
