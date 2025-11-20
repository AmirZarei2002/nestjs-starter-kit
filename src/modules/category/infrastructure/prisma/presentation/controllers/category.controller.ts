import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CacheInterceptor } from '@shared/cache/cache.interceptor';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  GetCategoryByIdUseCase,
  UpdateCategoryUseCase,
} from '@category/application';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.updateCategoryUseCase.execute(id, data);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll(@Query() query: PaginationQueryDto) {
    return this.getCategoriesUseCase.execute(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id') id: string) {
    return this.getCategoryByIdUseCase.execute(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute(id);
  }
}
