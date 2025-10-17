import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { QueryBudgetDto } from './dto/query-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgets: BudgetsService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = Number(year);
    const m = Number(month);
    if (
      !Number.isInteger(y) ||
      !Number.isInteger(m) ||
      m < 1 ||
      m > 12
    ) {
      throw new BadRequestException('Paramètres year/month invalides');
    }
    return this.budgets.list(req.user.sub, y, m);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateBudgetDto) {
    return this.budgets.create(req.user.sub, dto);
  }
}

