# Repository Pattern Guide

Understanding and implementing the Repository Pattern in starter-kit.

## 🎯 What is the Repository Pattern?

The Repository Pattern is a design pattern that abstracts data access logic, providing a collection-like interface for accessing domain objects.

### Key Benefits:
- ✅ **Abstraction**: Hide database implementation details
- ✅ **Testability**: Easy to mock for unit tests
- ✅ **Flexibility**: Swap database implementations
- ✅ **Maintainability**: Centralize data access logic
- ✅ **Separation**: Keep domain logic clean

## 🏗️ Structure

```
domain/interfaces/           # Contracts (what to do)
    └── *.repository.interface.ts

infrastructure/prisma/persistence/  # Implementation (how to do it)
    └── *.repository.ts
```

## 📝 Creating a Repository

### Step 1: Define Interface (Domain Layer)

Location: `domain/interfaces/category.repository.interface.ts`

```typescript
import { PaginatedResult } from '@common/types/paginated-result.type';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CategoryEntity } from '../entities/category.entity';

// One interface per operation (Single Responsibility)
export interface ICreateCategoryRepository {
  create(data: {
    name: string;
    description?: string;
  }): Promise<CategoryEntity | null>;
}

export interface IUpdateCategoryRepository {
  update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<CategoryEntity | null>;
}

export interface IFindCategoriesRepository {
  findAll(query: PaginationQueryDto): Promise<PaginatedResult<CategoryEntity>>;
}

export interface IFindCategoryByIdRepository {
  findOne(id: string): Promise<CategoryEntity | null>;
}

export interface IDeleteCategoryRepository {
  delete(id: string): Promise<void>;
}
```

**Why separate interfaces?**
- Single Responsibility Principle
- Use cases only depend on what they need
- Easier to test and mock
- Clear contracts

### Step 2: Implement Repository (Infrastructure Layer)

Location: `infrastructure/prisma/persistence/create-category.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ICreateCategoryRepository, CategoryEntity, CategoryMapper } from '@category/domain';
import { CreateCategoryDto } from '@category/application';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    // 1. Execute database operation
    const category = await this.prisma.category.create({ data });
    
    // 2. Map to domain entity
    return CategoryMapper.toEntity(category);
  }
}
```

## 🔄 Complete Examples

### Create Operation

```typescript
// 1. Interface (domain/interfaces/)
export interface ICreateCategoryRepository {
  create(data: {
    name: string;
    description?: string;
  }): Promise<CategoryEntity>;
}

// 2. Implementation (infrastructure/prisma/persistence/)
@Injectable()
export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({ data });
    return CategoryMapper.toEntity(category);
  }
}

// 3. Usage in Use Case
export class CreateCategoryUseCase {
  constructor(private repository: ICreateCategoryRepository) {}
  
  execute(data: CreateCategoryDto) {
    return this.repository.create(data);
  }
}
```

### Update Operation

```typescript
// 1. Interface
export interface IUpdateCategoryRepository {
  update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<CategoryEntity | null>;
}

// 2. Implementation
@Injectable()
export class UpdateCategoryRepository implements IUpdateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryEntity | null> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      return CategoryMapper.toEntity(category);
    } catch (error) {
      return null; // Not found
    }
  }
}
```

### Find All with Pagination

```typescript
// 1. Interface
export interface IFindCategoriesRepository {
  findAll(query: PaginationQueryDto): Promise<PaginatedResult<CategoryEntity>>;
}

// 2. Implementation
@Injectable()
export class GetCategoriesRepository implements IFindCategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll(query: PaginationQueryDto) {
    const { sort = 'createdAt', order = 'desc' } = query;
    const orderByClause = { [sort]: order };

    return paginate<
      Category,
      CategoryEntity,
      Prisma.CategoryFindManyArgs,
      Prisma.CategoryCountArgs
    >(
      this.prisma.category,
      query,
      (category) => CategoryMapper.toEntity(category),
      orderByClause,
    );
  }
}
```

### Find One by ID

```typescript
// 1. Interface
export interface IFindCategoryByIdRepository {
  findOne(id: string): Promise<CategoryEntity | null>;
}

// 2. Implementation
@Injectable()
export class GetCategoryByIdRepository implements IFindCategoryByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    
    if (!category) return null;
    
    return CategoryMapper.toEntity(category);
  }
}
```

### Delete Operation

```typescript
// 1. Interface
export interface IDeleteCategoryRepository {
  delete(id: string): Promise<void>;
}

// 2. Implementation
@Injectable()
export class DeleteCategoryRepository implements IDeleteCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
```

## 🎨 Advanced Patterns

### With Relations

```typescript
export interface IFindProductWithCategoryRepository {
  findOneWithCategory(id: string): Promise<ProductEntity | null>;
}

@Injectable()
export class GetProductWithCategoryRepository implements IFindProductWithCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneWithCategory(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // Include related category
      },
    });
    
    if (!product) return null;
    
    return ProductMapper.toEntity(product);
  }
}
```

### With Filtering

```typescript
export interface IFindCategoriesByNameRepository {
  findByName(name: string): Promise<CategoryEntity[]>;
}

@Injectable()
export class FindCategoriesByNameRepository implements IFindCategoriesByNameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    
    return categories.map(CategoryMapper.toEntity);
  }
}
```

### Bulk Operations

```typescript
export interface IBulkCreateProductsRepository {
  createMany(data: CreateProductDto[]): Promise<number>;
}

@Injectable()
export class BulkCreateProductsRepository implements IBulkCreateProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(data: CreateProductDto[]): Promise<number> {
    const result = await this.prisma.product.createMany({
      data,
      skipDuplicates: true,
    });
    
    return result.count;
  }
}
```

## 🧪 Testing Repositories

### Unit Test with Mock

```typescript
describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockRepository: jest.Mocked<ICreateCategoryRepository>;

  beforeEach(() => {
    // Mock repository
    mockRepository = {
      create: jest.fn(),
    };
    
    useCase = new CreateCategoryUseCase(mockRepository);
  });

  it('should create a category', async () => {
    const dto = { name: 'Test', description: 'Test' };
    const expectedEntity = new CategoryEntity(
      'id',
      'Test',
      'Test',
      new Date(),
      new Date(),
    );
    
    mockRepository.create.mockResolvedValue(expectedEntity);
    
    const result = await useCase.execute(dto);
    
    expect(result).toEqual(expectedEntity);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});
```

### Integration Test

```typescript
describe('CreateCategoryRepository', () => {
  let repository: CreateCategoryRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CreateCategoryRepository, PrismaService],
    }).compile();

    repository = module.get(CreateCategoryRepository);
    prisma = module.get(PrismaService);
  });

  it('should create a category in database', async () => {
    const dto = { name: 'Test', description: 'Test' };
    
    const result = await repository.create(dto);
    
    expect(result).toBeDefined();
    expect(result.name).toBe('Test');
    
    // Cleanup
    await prisma.category.delete({ where: { id: result.id } });
  });
});
```

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Put Business Logic in Repository

```typescript
// ❌ BAD
@Injectable()
export class CreateCategoryRepository {
  async create(data: CreateCategoryDto) {
    // Business logic in repository
    if (data.name.length < 3) {
      throw new BadRequestException('Name too short');
    }
    
    return this.prisma.category.create({ data });
  }
}

// ✅ GOOD - Business logic in use case
export class CreateCategoryUseCase {
  execute(data: CreateCategoryDto) {
    // Business validation here
    if (data.name.length < 3) {
      throw new BadRequestException('Name too short');
    }
    
    return this.repository.create(data);
  }
}
```

### ❌ DON'T: Return Prisma Models Directly

```typescript
// ❌ BAD
async create(data: CreateCategoryDto): Promise<Category> {
  return this.prisma.category.create({ data }); // Prisma model
}

// ✅ GOOD
async create(data: CreateCategoryDto): Promise<CategoryEntity> {
  const category = await this.prisma.category.create({ data });
  return CategoryMapper.toEntity(category); // Domain entity
}
```

### ❌ DON'T: Create God Repositories

```typescript
// ❌ BAD - One interface does everything
export interface ICategoryRepository {
  create(data: any): Promise<CategoryEntity>;
  update(id: string, data: any): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
  findAll(): Promise<CategoryEntity[]>;
  findOne(id: string): Promise<CategoryEntity>;
  findByName(name: string): Promise<CategoryEntity[]>;
  // ... 20 more methods
}

// ✅ GOOD - Separate interfaces
export interface ICreateCategoryRepository {
  create(data: CreateCategoryDto): Promise<CategoryEntity>;
}

export interface IFindCategoryByIdRepository {
  findOne(id: string): Promise<CategoryEntity | null>;
}
```

## 📋 Repository Checklist

When creating a repository:

- [ ] Interface defined in domain layer
- [ ] Implementation in infrastructure layer
- [ ] Injectable decorator added
- [ ] Prisma service injected
- [ ] Maps Prisma models to domain entities
- [ ] Returns domain entities (not Prisma models)
- [ ] Handles null/undefined cases
- [ ] No business logic in repository
- [ ] Implements only one interface
- [ ] Proper error handling

## 💡 Best Practices

### 1. One Repository Per Operation
```typescript
// ✅ Good - Focused responsibility
ICreateCategoryRepository
IUpdateCategoryRepository
IDeleteCategoryRepository
```

### 2. Return Domain Entities
```typescript
// Always use mapper
return CategoryMapper.toEntity(prismaModel);
```

### 3. Handle Null Cases
```typescript
async findOne(id: string): Promise<CategoryEntity | null> {
  const category = await this.prisma.category.findUnique({ where: { id } });
  if (!category) return null; // Explicit null handling
  return CategoryMapper.toEntity(category);
}
```

### 4. Use Dependency Injection
```typescript
constructor(private readonly prisma: PrismaService) {}
```

### 5. Keep Interfaces Simple
```typescript
// Simple, clear method signatures
create(data: CreateCategoryDto): Promise<CategoryEntity>;
```

## 🎯 Quick Reference

| Operation | Interface Name | Implementation Name |
|-----------|----------------|---------------------|
| Create | `ICreate{Entity}Repository` | `Create{Entity}Repository` |
| Update | `IUpdate{Entity}Repository` | `Update{Entity}Repository` |
| Delete | `IDelete{Entity}Repository` | `Delete{Entity}Repository` |
| Find All | `IFind{Entities}Repository` | `Get{Entities}Repository` |
| Find One | `IFind{Entity}ByIdRepository` | `Get{Entity}ByIdRepository` |

---

**Next:** Learn about [06-Use-Cases-Pattern.md](06-Use-Cases-Pattern.md)

