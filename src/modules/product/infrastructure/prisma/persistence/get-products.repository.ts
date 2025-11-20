import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { paginate } from '@common/utils/paginate.util';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import {
  ProductEntity,
  IFindProductsRepository,
  ProductMapper,
} from '@product/domain';

@Injectable()
export class GetProductsRepository implements IFindProductsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: PaginationQueryDto) {
    const { sort = 'createdAt', order = 'desc' } = query;
    const orderByClause = { [sort]: order };

    return paginate<
      Product,
      ProductEntity,
      Prisma.ProductFindManyArgs,
      Prisma.ProductCountArgs
    >(
      this.prisma.product,
      query,
      (product) => ProductMapper.toEntity(product),
      {},
      orderByClause, 
    );
  }
}

