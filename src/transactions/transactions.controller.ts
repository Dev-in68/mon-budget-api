import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private tx: TransactionsService) {}
  @Get()
  list(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    if (year && month) {
      const y = Number(year);
      const m = Number(month);
      const from = new Date(Date.UTC(y, m - 1, 1));
      const to = new Date(Date.UTC(y, m, 1));
      return this.tx.list(req.user.sub, from, to);
    }
    return this.tx.list(req.user.sub);
  }
  @Post() create(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.tx.create(req.user.sub, dto);
  }
  @Delete(':id') del(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tx.delete(req.user.sub, id);
  }
}
