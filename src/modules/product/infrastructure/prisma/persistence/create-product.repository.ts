import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateProductDto } from '@product/application';
import {
  ProductEntity,
  ICreateProductRepository,
  ProductMapper,
} from '@product/domain';

@Injectable()
export class CreateProductRepository implements ICreateProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    const product = await this.prisma.product.create({ data });

    return ProductMapper.toEntity(product);
  }
}

