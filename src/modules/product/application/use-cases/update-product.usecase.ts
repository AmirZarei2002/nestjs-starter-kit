import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductEntity,
  IFindProductByIdRepository,
  IUpdateProductRepository,
} from '@product/domain';
import { IFindCategoryByIdRepository } from '@modules/category/domain';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly updateProductRepository: IUpdateProductRepository,
    private readonly findProductByIdRepository: IFindProductByIdRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string, data: UpdateProductDto): Promise<ProductEntity> {
    const productExists = await this.findProductByIdRepository.findOne(id);

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    // If categoryId is being updated, check if category exists
    if (data.categoryId) {
      const category = await this.findCategoryByIdRepository.findOne(
        data.categoryId,
      );

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const product = await this.updateProductRepository.update(id, data);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}

