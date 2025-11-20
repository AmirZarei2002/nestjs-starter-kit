import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity, ICreateProductRepository } from '@product/domain';
import { IFindCategoryByIdRepository } from '@modules/category/domain';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly createProductRepository: ICreateProductRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(data: CreateProductDto): Promise<ProductEntity | null> {
    // Check if category exists
    const category = await this.findCategoryByIdRepository.findOne(
      data.categoryId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return await this.createProductRepository.create(data);
  }
}

