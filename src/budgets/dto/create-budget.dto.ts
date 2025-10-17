import { IsInt, Max, Min, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsInt() year: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  limit: number;
}
