import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UpdateProductDto } from '@product/application';
import {
  ProductEntity,
  IUpdateProductRepository,
  ProductMapper,
} from '@product/domain';

@Injectable()
export class UpdateProductRepository implements IUpdateProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductEntity | null> {
    const product = await this.prisma.product.update({ where: { id }, data });
    return ProductMapper.toEntity(product);
  }
}

