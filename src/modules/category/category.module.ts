import { Module } from '@nestjs/common';
import { CustomCacheModule } from '@shared/cache/cache.module';
import { CustomLoggerService } from '@shared/services/custom-logger.service';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  GetCategoryByIdUseCase,
  UpdateCategoryUseCase,
} from './application';
import {
  ICreateCategoryRepository,
  IDeleteCategoryRepository,
  IFindCategoriesRepository,
  IFindCategoryByIdRepository,
  IUpdateCategoryRepository,
  CATEGORY_REPOSITORY_TOKENS,
} from './domain';
import {
  CategoryController,
  CreateCategoryRepository,
  DeleteCategoryRepository,
  GetCategoriesRepository,
  GetCategoryByIdRepository,
  UpdateCategoryRepository,
} from './infrastructure';

@Module({
  imports: [CustomCacheModule],
  exports: [
    // Export the token so other modules can use it
    {
      provide: CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      useClass: GetCategoryByIdRepository,
    },
  ],
  controllers: [CategoryController],
  providers: [
    PrismaService,
    CustomLoggerService,

    // Repositories
    CreateCategoryRepository,
    UpdateCategoryRepository,
    GetCategoriesRepository,
    GetCategoryByIdRepository,
    DeleteCategoryRepository,
    // Provide the token within this module
    {
      provide: CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      useClass: GetCategoryByIdRepository,
    },

    // Use Cases
    {
      provide: CreateCategoryUseCase,
      useFactory: (createCategoryRepo: ICreateCategoryRepository) =>
        new CreateCategoryUseCase(createCategoryRepo),
      inject: [CreateCategoryRepository],
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: (
        updateCategoryRepo: IUpdateCategoryRepository,
        findOneCategoryRepo: IFindCategoryByIdRepository,
      ) => new UpdateCategoryUseCase(updateCategoryRepo, findOneCategoryRepo),
      inject: [UpdateCategoryRepository, CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID],
    },
    {
      provide: GetCategoriesUseCase,
      useFactory: (findAllCategoriesRepo: IFindCategoriesRepository) =>
        new GetCategoriesUseCase(findAllCategoriesRepo),
      inject: [GetCategoriesRepository],
    },
    {
      provide: GetCategoryByIdUseCase,
      useFactory: (findOneCategoryRepo: IFindCategoryByIdRepository) =>
        new GetCategoryByIdUseCase(findOneCategoryRepo),
      inject: [CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (
        deleteCategoryRepo: IDeleteCategoryRepository,
        findOneCategoryRepo: IFindCategoryByIdRepository,
      ) => new DeleteCategoryUseCase(deleteCategoryRepo, findOneCategoryRepo),
      inject: [DeleteCategoryRepository, CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID],
    },
  ],
})
export class CategoryModule {}
