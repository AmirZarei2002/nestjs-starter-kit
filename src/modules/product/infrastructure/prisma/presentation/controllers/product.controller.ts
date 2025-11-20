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
  CreateProductDto,
  UpdateProductDto,
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductsUseCase,
  GetProductByIdUseCase,
  UpdateProductUseCase,
} from '@product/application';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.createProductUseCase.execute(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, data);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll(@Query() query: PaginationQueryDto) {
    return this.getProductsUseCase.execute(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }
}

