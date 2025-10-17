import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { QueryBudgetDto } from './dto/query-budget.dto';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgets: BudgetsService) {}

  @Get()
  list(@Req() req: any, @Query() q: QueryBudgetDto) {
    return this.budgets.list(req.user.sub, q.year, q.month);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateBudgetDto) {
    return this.budgets.create(req.user.sub, dto);
  }
}
