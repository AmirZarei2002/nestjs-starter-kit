import { Product } from '@prisma/client';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toEntity(product: Product): ProductEntity {
    if (!product) {
      throw new Error('Product data is undefined');
    }
    return new ProductEntity(
      product.id,
      product.name,
      product.description ?? '',
      product.price,
      product.stock,
      product.categoryId,
      product.createdAt,
      product.updatedAt,
    );
  }
}

