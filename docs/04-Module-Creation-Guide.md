# Module Creation Guide

Step-by-step guide to creating a new module in starter-kit following Clean Architecture principles.

## 🎯 Overview

This guide will walk you through creating a complete **Product** module as an example. You can follow the same pattern for any new feature.

## 📋 Prerequisites

Before creating a module, ensure you:
- Understand [03-Architecture-Overview.md](03-Architecture-Overview.md)
- Have reviewed the `Category` module as reference
- Know the business requirements

## 🚀 Step-by-Step Creation

### Step 1: Create Module Structure

Create the directory structure:

```bash
mkdir -p src/modules/product/{domain/{entities,interfaces,mappers},application/{dtos,use-cases},infrastructure/prisma/{persistence,presentation/controllers}}
```

Your structure should look like:

```
src/modules/product/
├── domain/
│   ├── entities/
│   ├── interfaces/
│   ├── mappers/
│   └── index.ts
├── application/
│   ├── dtos/
│   ├── use-cases/
│   └── index.ts
├── infrastructure/
│   ├── prisma/
│   │   ├── persistence/
│   │   ├── presentation/
│   │   │   └── controllers/
│   │   └── products.seed.ts
│   └── index.ts
├── product.module.ts
└── index.ts
```

### Step 2: Update Database Schema

Add your table to `prisma/schema.prisma`:

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  price       Float
  stock       Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Update Category model to include relation
model Category {
  // ... existing fields
  products    Product[]
}
```

Run migrations:

```bash
npx prisma migrate dev --name add-product-table
npx prisma generate
```

### Step 3: Create Domain Layer

#### 3.1. Domain Entity

`domain/entities/product.entity.ts`:

```typescript
export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Business logic methods
  isInStock(): boolean {
    return this.stock > 0;
  }

  isAffordable(budget: number): boolean {
    return this.price <= budget;
  }
}
```

#### 3.2. Repository Interfaces

`domain/interfaces/product.repository.interface.ts`:

```typescript
import { PaginatedResult } from '@common/types/paginated-result.type';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { ProductEntity } from '../entities/product.entity';

export interface ICreateProductRepository {
  create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
  }): Promise<ProductEntity>;
}

export interface IUpdateProductRepository {
  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
    },
  ): Promise<ProductEntity | null>;
}

export interface IFindProductsRepository {
  findAll(query: PaginationQueryDto): Promise<PaginatedResult<ProductEntity>>;
}

export interface IFindProductByIdRepository {
  findOne(id: string): Promise<ProductEntity | null>;
}

export interface IDeleteProductRepository {
  delete(id: string): Promise<void>;
}
```

#### 3.3. Mapper

`domain/mappers/product.mapper.ts`:

```typescript
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
```

#### 3.4. Domain Barrel Export

`domain/index.ts`:

```typescript
// Entities
export * from './entities/product.entity';

// Interfaces
export * from './interfaces/product.repository.interface';

// Mappers
export * from './mappers/product.mapper';
```

### Step 4: Create Application Layer

#### 4.1. DTOs

`application/dtos/create-product.dto.ts`:

```typescript
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
```

`application/dtos/update-product.dto.ts`:

```typescript
import { IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
```

#### 4.2. Use Cases

`application/use-cases/create-product.usecase.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ICreateProductRepository, ProductEntity } from '@product/domain';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly createProductRepository: ICreateProductRepository,
  ) {}

  async execute(data: CreateProductDto): Promise<ProductEntity> {
    return await this.createProductRepository.create(data);
  }
}
```

`application/use-cases/update-product.usecase.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IFindProductByIdRepository,
  IUpdateProductRepository,
  ProductEntity,
} from '@product/domain';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly updateProductRepository: IUpdateProductRepository,
    private readonly findProductByIdRepository: IFindProductByIdRepository,
  ) {}

  async execute(id: string, data: UpdateProductDto): Promise<ProductEntity> {
    const productExists = await this.findProductByIdRepository.findOne(id);

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.updateProductRepository.update(id, data);
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
```

Create similar files for:
- `get-products.usecase.ts`
- `get-product-by-id.usecase.ts`
- `delete-product.usecase.ts`

#### 4.3. Application Barrel Export

`application/index.ts`:

```typescript
// DTOs
export * from './dtos/create-product.dto';
export * from './dtos/update-product.dto';

// Use Cases
export * from './use-cases/create-product.usecase';
export * from './use-cases/update-product.usecase';
export * from './use-cases/get-products.usecase';
export * from './use-cases/get-product-by-id.usecase';
export * from './use-cases/delete-product.usecase';
```

### Step 5: Create Infrastructure Layer

#### 5.1. Repositories

`infrastructure/prisma/persistence/create-product.repository.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ICreateProductRepository, ProductEntity, ProductMapper } from '@product/domain';
import { CreateProductDto } from '@product/application';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CreateProductRepository implements ICreateProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    const product = await this.prisma.product.create({ data });
    return ProductMapper.toEntity(product);
  }
}
```

Create similar files for:
- `update-product.repository.ts`
- `get-products.repository.ts`
- `get-product-by-id.repository.ts`
- `delete-product.repository.ts`

#### 5.2. Controller

`infrastructure/prisma/presentation/controllers/product.controller.ts`:

```typescript
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
import {
  CreateProductDto,
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  UpdateProductDto,
  UpdateProductUseCase,
} from '@product/application';
import { CacheInterceptor } from '@shared/cache/cache.interceptor';

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
```

#### 5.3. Infrastructure Barrel Export

`infrastructure/index.ts`:

```typescript
// Repositories
export * from './prisma/persistence/create-product.repository';
export * from './prisma/persistence/update-product.repository';
export * from './prisma/persistence/get-products.repository';
export * from './prisma/persistence/get-product-by-id.repository';
export * from './prisma/persistence/delete-product.repository';

// Controllers
export * from './prisma/presentation/controllers/product.controller';
```

### Step 6: Create Module Definition

`product.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CustomCacheModule } from '@shared/cache/cache.module';
import { CustomLoggerService } from '@shared/services/custom-logger.service';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
} from './application';
import {
  ICreateProductRepository,
  IDeleteProductRepository,
  IFindProductByIdRepository,
  IFindProductsRepository,
  IUpdateProductRepository,
} from './domain';
import {
  CreateProductRepository,
  DeleteProductRepository,
  GetProductByIdRepository,
  GetProductsRepository,
  ProductController,
  UpdateProductRepository,
} from './infrastructure';

@Module({
  imports: [CustomCacheModule],
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
      useFactory: (createProductRepo: ICreateProductRepository) =>
        new CreateProductUseCase(createProductRepo),
      inject: [CreateProductRepository],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (
        updateProductRepo: IUpdateProductRepository,
        findOneProductRepo: IFindProductByIdRepository,
      ) => new UpdateProductUseCase(updateProductRepo, findOneProductRepo),
      inject: [UpdateProductRepository, GetProductByIdRepository],
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
```

### Step 7: Add Path Alias

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@common/*": ["./src/common/*"],
      "@shared/*": ["./src/shared/*"],
      "@config/*": ["./src/config/*"],
      "@prisma/*": ["./src/prisma/*"],
      "@modules/*": ["./src/modules/*"],
      "@category/*": ["./src/modules/category/*"],
      "@product/*": ["./src/modules/product/*"]  // Add this
    }
  }
}
```

### Step 8: Create Main Barrel Export

`index.ts`:

```typescript
// Module
export * from './product.module';

// Re-export application layer (public API)
export * from './application';

// Re-export domain layer (public API)
export * from './domain';
```

### Step 9: Register Module in App

Update `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module'; // Add this

@Module({
  imports: [
    // ... other imports
    CategoryModule,
    ProductModule, // Add this
  ],
  // ...
})
export class AppModule {}
```

### Step 10: Create Seed Data (Optional)

`infrastructure/prisma/products.seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productsData = [
  {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1200.00,
    stock: 50,
    categoryId: 'category-id-here', // Get from category seed
  },
  // ... more products
];

export async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  for (const productData of productsData) {
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Products seeded successfully');
}
```

Update `src/prisma/seed.ts`:

```typescript
import { seedProducts } from '../modules/product/infrastructure/prisma/products.seed';

async function seed() {
  await seedCategories();
  await seedProducts(); // Add this
  // ... other seeds
}
```

## ✅ Verification Checklist

After creating your module, verify:

- [ ] All files created
- [ ] Barrel exports (`index.ts`) in place
- [ ] Path alias added to `tsconfig.json`
- [ ] Module registered in `app.module.ts`
- [ ] Database schema updated
- [ ] Migrations run
- [ ] ESLint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Seeds work: `npm run seed`

## 🧪 Test Your Module

```bash
# Start server
npm run start:dev

# Test endpoints
curl http://localhost:3000/api/v1/products
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"stock":10,"categoryId":"uuid-here"}'
```

## 📋 Module Starter-kit Checklist

Use this checklist when creating any new module:

```
Module: _____________

Domain Layer:
[ ] entities/          (business models)
[ ] interfaces/        (repository contracts)
[ ] mappers/          (data transformations)
[ ] index.ts          (barrel export)

Application Layer:
[ ] dtos/             (validation objects)
[ ] use-cases/        (business operations)
[ ] index.ts          (barrel export)

Infrastructure Layer:
[ ] persistence/      (repository implementations)
[ ] controllers/      (HTTP endpoints)
[ ] seeds/           (optional)
[ ] index.ts         (barrel export)

Module Setup:
[ ] module.ts         (NestJS module)
[ ] index.ts          (main export)
[ ] Path alias        (tsconfig.json)
[ ] App registration  (app.module.ts)

Database:
[ ] Schema updated    (schema.prisma)
[ ] Migration run     (prisma migrate)
[ ] Seeds created     (optional)

Quality:
[ ] ESLint passes
[ ] Build succeeds
[ ] Tests written
[ ] Documentation added
```

## 💡 Tips & Best Practices

### DO:
✅ Follow the three-layer structure  
✅ Use interfaces for repositories  
✅ Create separate use cases for each operation  
✅ Use barrel exports  
✅ Add validation to DTOs  
✅ Use path aliases  
✅ Keep entities pure (no framework code)  
✅ Test each layer independently  

### DON'T:
❌ Mix business logic with infrastructure  
❌ Access database directly from use cases  
❌ Use framework code in domain layer  
❌ Create circular dependencies  
❌ Skip barrel exports  
❌ Use relative imports across modules  

## 🚀 Quick Commands

```bash
# Create module structure
mkdir -p src/modules/{module-name}/{domain,application,infrastructure}

# Add migration
npx prisma migrate dev --name add-{module-name}-table

# Run linting
npm run lint -- --fix

# Build project
npm run build

# Test endpoints
npm run start:dev
```

---

**Next:** Learn about [05-Repository-Pattern.md](05-Repository-Pattern.md)

