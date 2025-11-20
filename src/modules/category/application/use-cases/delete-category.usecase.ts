import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDeleteCategoryRepository,
  IFindCategoryByIdRepository,
} from '@category/domain';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly deleteCategoryRepository: IDeleteCategoryRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.findCategoryByIdRepository.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.deleteCategoryRepository.delete(id);
  }
}
