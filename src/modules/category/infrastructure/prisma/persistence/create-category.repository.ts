import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCategoryDto } from '@category/application';
import {
  CategoryEntity,
  ICreateCategoryRepository,
  CategoryMapper,
} from '@category/domain';

@Injectable()
export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({ data });

    return CategoryMapper.toEntity(category);
  }
}
