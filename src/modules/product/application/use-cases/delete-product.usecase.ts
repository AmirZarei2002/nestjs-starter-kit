import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDeleteProductRepository,
  IFindProductByIdRepository,
} from '@product/domain';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly deleteProductRepository: IDeleteProductRepository,
    private readonly findProductByIdRepository: IFindProductByIdRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.findProductByIdRepository.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.deleteProductRepository.delete(id);
  }
}

