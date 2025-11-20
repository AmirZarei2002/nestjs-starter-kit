import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  @Type(() => String)
  sort?: 'createdAt' | 'updatedAt';

  @IsOptional()
  @Type(() => String)
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => String)
  include?: string[];
}
