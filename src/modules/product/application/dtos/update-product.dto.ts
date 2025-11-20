import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock: number;

  @IsUUID()
  @IsOptional()
  categoryId: string;
}

