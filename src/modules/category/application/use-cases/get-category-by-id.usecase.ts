import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity, IFindCategoryByIdRepository } from '@category/domain';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string): Promise<CategoryEntity> {
    const category = await this.findCategoryByIdRepository.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
