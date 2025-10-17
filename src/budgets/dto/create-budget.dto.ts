import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsInt() year!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsPositive() limit!: number;
}
