import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly createCategoryRepository: ICreateCategoryRepository,
  ) {}

  async execute(data: CreateCategoryDto): Promise<CategoryEntity | null> {
    return await this.createCategoryRepository.create(data);
  }
}
