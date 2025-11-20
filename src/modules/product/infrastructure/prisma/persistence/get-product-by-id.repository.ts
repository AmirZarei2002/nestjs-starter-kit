import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  ProductEntity,
  IFindProductByIdRepository,
  ProductMapper,
} from '@product/domain';

@Injectable()
export class GetProductByIdRepository implements IFindProductByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return ProductMapper.toEntity(product);
  }
}

