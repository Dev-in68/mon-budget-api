import { IsInt, IsNumber, Max, Min } from 'class-validator';
export class UpsertBudgetDto {
  @IsInt() year: number;
  @IsInt() @Min(1) @Max(12) month: number;
  @IsNumber() limit: number;
}
