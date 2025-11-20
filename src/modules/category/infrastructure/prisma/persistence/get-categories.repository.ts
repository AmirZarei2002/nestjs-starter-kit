import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { paginate } from '@common/utils/paginate.util';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import {
  CategoryEntity,
  IFindCategoriesRepository,
  CategoryMapper,
} from '@category/domain';

@Injectable()
export class GetCategoriesRepository implements IFindCategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: PaginationQueryDto) {
    const { sort = 'createdAt', order = 'desc' } = query;
    const orderByClause = { [sort]: order };

    return paginate<
      Category,
      CategoryEntity,
      Prisma.CategoryFindManyArgs,
      Prisma.CategoryCountArgs
    >(
      this.prisma.category,
      query,
      (category) => CategoryMapper.toEntity(category),
      {}, 
      orderByClause,
    );
  }
}
