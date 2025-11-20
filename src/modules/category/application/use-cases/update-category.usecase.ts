import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryEntity,
  IFindCategoryByIdRepository,
  IUpdateCategoryRepository,
} from '@category/domain';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly updateCategoryRepository: IUpdateCategoryRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string, data: UpdateCategoryDto): Promise<CategoryEntity> {
    const categoryExists = await this.findCategoryByIdRepository.findOne(id);

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    const category = await this.updateCategoryRepository.update(id, data);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
