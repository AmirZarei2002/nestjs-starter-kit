import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity, IFindProductByIdRepository } from '@product/domain';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    private readonly findProductByIdRepository: IFindProductByIdRepository,
  ) {}

  async execute(id: string): Promise<ProductEntity> {
    const product = await this.findProductByIdRepository.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}

