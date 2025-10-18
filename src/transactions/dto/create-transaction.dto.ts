import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateTransactionDto {
  @IsNumber() amount!: number;
  @IsDateString() date!: string;
  @IsInt() categoryId!: number;
  @IsOptional() @IsString() note?: string;
}
