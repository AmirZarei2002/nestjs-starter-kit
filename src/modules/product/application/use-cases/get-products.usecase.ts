import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PaginatedResult } from '@common/types/paginated-result.type';
import { ProductEntity, IFindProductsRepository } from '@product/domain';

@Injectable()
export class GetProductsUseCase {
  constructor(
    private readonly findProductsRepository: IFindProductsRepository,
  ) {}

  async execute(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<ProductEntity>> {
    return await this.findProductsRepository.findAll(query);
  }
}

