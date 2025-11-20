import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PaginatedResult } from '@common/types/paginated-result.type';
import { CategoryEntity } from '../entities/category.entity';

export interface ICreateCategoryRepository {
  create(data: {
    name: string;
    description?: string;
  }): Promise<CategoryEntity | null>;
}

export interface IUpdateCategoryRepository {
  update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<CategoryEntity | null>;
}

export interface IFindCategoriesRepository {
  findAll(query: PaginationQueryDto): Promise<PaginatedResult<CategoryEntity>>;
}

export interface IFindCategoryByIdRepository {
  findOne(id: string): Promise<CategoryEntity | null>;
}

export interface IDeleteCategoryRepository {
  delete(id: string): Promise<void>;
}
