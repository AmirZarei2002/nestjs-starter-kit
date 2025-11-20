import { Category } from '@prisma/client';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toEntity(category: Category): CategoryEntity {
    if (!category) {
      throw new Error('Category data is undefined');
    }
    return new CategoryEntity(
      category.id,
      category.name,
      category.description ?? '',
      category.createdAt,
      category.updatedAt,
    );
  }
}
