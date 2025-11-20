import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CategoryEntity,
  IFindCategoryByIdRepository,
  CategoryMapper,
} from '@category/domain';

@Injectable()
export class GetCategoryByIdRepository implements IFindCategoryByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) return null;
    return CategoryMapper.toEntity(category);
  }
}
