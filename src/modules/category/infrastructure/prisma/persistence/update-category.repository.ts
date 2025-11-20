import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UpdateCategoryDto } from '@category/application';
import {
  CategoryEntity,
  IUpdateCategoryRepository,
  CategoryMapper,
} from '@category/domain';

@Injectable()
export class UpdateCategoryRepository implements IUpdateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.update({ where: { id }, data });
    return CategoryMapper.toEntity(category);
  }
}
