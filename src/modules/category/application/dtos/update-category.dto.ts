import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(3, 30)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
