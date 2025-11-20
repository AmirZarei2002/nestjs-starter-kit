import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PaginatedResult } from '@common/types/paginated-result.type';
import { ProductEntity } from '../entities/product.entity';

export interface ICreateProductRepository {
  create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
  }): Promise<ProductEntity | null>;
}

export interface IUpdateProductRepository {
  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
    },
  ): Promise<ProductEntity | null>;
}

export interface IFindProductsRepository {
  findAll(query: PaginationQueryDto): Promise<PaginatedResult<ProductEntity>>;
}

export interface IFindProductByIdRepository {
  findOne(id: string): Promise<ProductEntity | null>;
}

export interface IDeleteProductRepository {
  delete(id: string): Promise<void>;
}

