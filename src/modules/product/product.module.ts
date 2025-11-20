import { Module } from '@nestjs/common';
import { CustomCacheModule } from '@shared/cache/cache.module';
import { CustomLoggerService } from '@shared/services/custom-logger.service';
import { PrismaService } from '@prisma/prisma.service';
import { CategoryModule, CATEGORY_REPOSITORY_TOKENS } from '@modules/category';
import { IFindCategoryByIdRepository } from '@modules/category/domain';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductsUseCase,
  GetProductByIdUseCase,
  UpdateProductUseCase,
} from './application';
import {
  ICreateProductRepository,
  IDeleteProductRepository,
  IFindProductsRepository,
  IFindProductByIdRepository,
  IUpdateProductRepository,
} from './domain';
import {
  ProductController,
  CreateProductRepository,
  DeleteProductRepository,
  GetProductsRepository,
  GetProductByIdRepository,
  UpdateProductRepository,
} from './infrastructure';

@Module({
  imports: [CustomCacheModule, CategoryModule],
  exports: [GetProductByIdRepository],
  controllers: [ProductController],
  providers: [
    PrismaService,
    CustomLoggerService,

    // Repositories
    CreateProductRepository,
    UpdateProductRepository,
    GetProductsRepository,
    GetProductByIdRepository,
    DeleteProductRepository,

    // Use Cases
    {
      provide: CreateProductUseCase,
      useFactory: (
        createProductRepo: ICreateProductRepository,
        findCategoryByIdRepo: IFindCategoryByIdRepository,
      ) =>
        new CreateProductUseCase(createProductRepo, findCategoryByIdRepo),
      inject: [CreateProductRepository, CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (
        updateProductRepo: IUpdateProductRepository,
        findOneProductRepo: IFindProductByIdRepository,
        findCategoryByIdRepo: IFindCategoryByIdRepository,
      ) =>
        new UpdateProductUseCase(
          updateProductRepo,
          findOneProductRepo,
          findCategoryByIdRepo,
        ),
      inject: [
        UpdateProductRepository,
        GetProductByIdRepository,
        CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      ],
    },
    {
      provide: GetProductsUseCase,
      useFactory: (findAllProductsRepo: IFindProductsRepository) =>
        new GetProductsUseCase(findAllProductsRepo),
      inject: [GetProductsRepository],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (findOneProductRepo: IFindProductByIdRepository) =>
        new GetProductByIdUseCase(findOneProductRepo),
      inject: [GetProductByIdRepository],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (
        deleteProductRepo: IDeleteProductRepository,
        findOneProductRepo: IFindProductByIdRepository,
      ) => new DeleteProductUseCase(deleteProductRepo, findOneProductRepo),
      inject: [DeleteProductRepository, GetProductByIdRepository],
    },
  ],
})
export class ProductModule {}

