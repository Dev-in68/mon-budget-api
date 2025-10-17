import { IsEnum, IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty() name: string;
  @IsEnum(['INCOME', 'EXPENSE'] as any) type: any;
}
