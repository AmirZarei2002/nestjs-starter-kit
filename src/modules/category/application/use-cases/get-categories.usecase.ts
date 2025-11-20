import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PaginatedResult } from '@common/types/paginated-result.type';
import { CategoryEntity, IFindCategoriesRepository } from '@category/domain';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    private readonly findCategoriesRepository: IFindCategoriesRepository,
  ) {}

  async execute(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<CategoryEntity>> {
    return await this.findCategoriesRepository.findAll(query);
  }
}
