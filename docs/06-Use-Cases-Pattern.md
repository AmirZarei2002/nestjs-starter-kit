# Use Cases Pattern Guide

Understanding and implementing Use Cases (Application Services) in starter-kit.

## 🎯 What is a Use Case?

A Use Case represents a single business operation or workflow. It orchestrates the flow of data between layers and contains business rules.

### Key Characteristics:
- ✅ **Single Responsibility**: One use case = one operation
- ✅ **Business Logic**: Contains workflow rules
- ✅ **Framework Agnostic**: Independent of NestJS/HTTP
- ✅ **Testable**: Easy to unit test
- ✅ **Reusable**: Can be called from different interfaces (HTTP, CLI, GraphQL)

## 📁 Location

```
src/modules/{module}/application/use-cases/
├── create-{entity}.usecase.ts
├── update-{entity}.usecase.ts
├── delete-{entity}.usecase.ts
├── get-{entities}.usecase.ts
└── get-{entity}-by-id.usecase.ts
```

## 📝 Basic Structure

```typescript
import { Injectable } from '@nestjs/common';
import { EntityType, IRepositoryInterface } from '@module/domain';
import { DTOType } from '../dtos/dto-name.dto';

@Injectable()
export class OperationEntityUseCase {
  constructor(
    private readonly repository: IRepositoryInterface,
  ) {}

  async execute(/* parameters */): Promise<ReturnType> {
    // 1. Business validation
    // 2. Call repository
    // 3. Business logic
    // 4. Return result
  }
}
```

## 🔄 Complete Examples

### Create Use Case

```typescript
import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly createCategoryRepository: ICreateCategoryRepository,
  ) {}

  async execute(data: CreateCategoryDto): Promise<CategoryEntity> {
    // You can add business logic here
    // e.g., check for duplicates, apply business rules
    
    return await this.createCategoryRepository.create(data);
  }
}
```

### Update Use Case

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryEntity,
  IFindCategoryByIdRepository,
  IUpdateCategoryRepository,
} from '@category/domain';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly updateCategoryRepository: IUpdateCategoryRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string, data: UpdateCategoryDto): Promise<CategoryEntity> {
    // 1. Verify entity exists
    const categoryExists = await this.findCategoryByIdRepository.findOne(id);

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    // 2. Apply business rules
    // e.g., prevent updating if has active products
    
    // 3. Update
    const category = await this.updateCategoryRepository.update(id, data);
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
```

### Delete Use Case

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IDeleteCategoryRepository,
  IFindCategoryByIdRepository,
} from '@category/domain';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly deleteCategoryRepository: IDeleteCategoryRepository,
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Check if exists
    const category = await this.findCategoryByIdRepository.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // 2. Business rule: Can't delete if has products
    // if (category.hasProducts()) {
    //   throw new BadRequestException('Cannot delete category with products');
    // }

    // 3. Delete
    await this.deleteCategoryRepository.delete(id);
  }
}
```

### Get All Use Case

```typescript
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PaginatedResult } from '@common/types/paginated-result.type';
import { CategoryEntity, IFindCategoriesRepository } from '@category/domain';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    private readonly findCategoriesRepository: IFindCategoriesRepository,
  ) {}

  async execute(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<CategoryEntity>> {
    return await this.findCategoriesRepository.findAll(query);
  }
}
```

### Get By ID Use Case

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity, IFindCategoryByIdRepository } from '@category/domain';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    private readonly findCategoryByIdRepository: IFindCategoryByIdRepository,
  ) {}

  async execute(id: string): Promise<CategoryEntity> {
    const category = await this.findCategoryByIdRepository.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
```

## 🎨 Advanced Patterns

### Complex Business Logic

```typescript
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly createOrderRepository: ICreateOrderRepository,
    private readonly findProductRepository: IFindProductByIdRepository,
    private readonly updateProductStockRepository: IUpdateProductStockRepository,
    private readonly calculateTaxService: CalculateTaxService,
  ) {}

  async execute(data: CreateOrderDto): Promise<OrderEntity> {
    // 1. Validate products exist and in stock
    for (const item of data.items) {
      const product = await this.findProductRepository.findOne(item.productId);
      
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
    }

    // 2. Calculate totals
    const subtotal = this.calculateSubtotal(data.items);
    const tax = this.calculateTaxService.calculate(subtotal);
    const total = subtotal + tax;

    // 3. Create order
    const order = await this.createOrderRepository.create({
      ...data,
      subtotal,
      tax,
      total,
      status: 'pending',
    });

    // 4. Update product stocks
    for (const item of data.items) {
      await this.updateProductStockRepository.decrementStock(
        item.productId,
        item.quantity,
      );
    }

    return order;
  }

  private calculateSubtotal(items: OrderItemDto[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
```

### Multiple Repository Dependencies

```typescript
@Injectable()
export class TransferProductCategoryUseCase {
  constructor(
    private readonly findProductRepository: IFindProductByIdRepository,
    private readonly findCategoryRepository: IFindCategoryByIdRepository,
    private readonly updateProductRepository: IUpdateProductRepository,
  ) {}

  async execute(productId: string, newCategoryId: string): Promise<ProductEntity> {
    // 1. Verify product exists
    const product = await this.findProductRepository.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Verify new category exists
    const category = await this.findCategoryRepository.findOne(newCategoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // 3. Business rule: Can't move to same category
    if (product.categoryId === newCategoryId) {
      throw new BadRequestException('Product already in this category');
    }

    // 4. Update product
    return await this.updateProductRepository.update(productId, {
      categoryId: newCategoryId,
    });
  }
}
```

### Transaction Handling

```typescript
@Injectable()
export class ProcessRefundUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOrderRepository: IFindOrderByIdRepository,
  ) {}

  async execute(orderId: string): Promise<OrderEntity> {
    // Find order first
    const order = await this.findOrderRepository.findOne(orderId);
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Use transaction for atomic operations
    return await this.prisma.$transaction(async (tx) => {
      // 1. Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'refunded' },
      });

      // 2. Restore product stocks
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // 3. Create refund record
      await tx.refund.create({
        data: {
          orderId,
          amount: order.total,
          reason: 'Customer requested',
        },
      });

      return OrderMapper.toEntity(updatedOrder);
    });
  }
}
```

## 🧪 Testing Use Cases

### Unit Test

```typescript
describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockRepository: jest.Mocked<ICreateCategoryRepository>;

  beforeEach(() => {
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

### Test with Business Logic

```typescript
describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let mockUpdateRepository: jest.Mocked<IUpdateCategoryRepository>;
  let mockFindRepository: jest.Mocked<IFindCategoryByIdRepository>;

  beforeEach(() => {
    mockUpdateRepository = {
      update: jest.fn(),
    };
    
    mockFindRepository = {
      findOne: jest.fn(),
    };
    
    useCase = new UpdateCategoryUseCase(
      mockUpdateRepository,
      mockFindRepository,
    );
  });

  it('should throw NotFoundException if category not found', async () => {
    mockFindRepository.findOne.mockResolvedValue(null);
    
    await expect(
      useCase.execute('non-existent-id', { name: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update category if exists', async () => {
    const existingCategory = new CategoryEntity(
      'id',
      'Old Name',
      'Desc',
      new Date(),
      new Date(),
    );
    
    const updatedCategory = new CategoryEntity(
      'id',
      'New Name',
      'Desc',
      new Date(),
      new Date(),
    );
    
    mockFindRepository.findOne.mockResolvedValue(existingCategory);
    mockUpdateRepository.update.mockResolvedValue(updatedCategory);
    
    const result = await useCase.execute('id', { name: 'New Name' });
    
    expect(result.name).toBe('New Name');
    expect(mockUpdateRepository.update).toHaveBeenCalledWith('id', { name: 'New Name' });
  });
});
```

## 🚫 Common Mistakes

### ❌ DON'T: Put Infrastructure Code in Use Case

```typescript
// ❌ BAD
export class CreateCategoryUseCase {
  constructor(private prisma: PrismaService) {} // Direct Prisma dependency
  
  async execute(data: CreateCategoryDto) {
    return this.prisma.category.create({ data }); // Direct DB access
  }
}

// ✅ GOOD
export class CreateCategoryUseCase {
  constructor(private repository: ICreateCategoryRepository) {} // Interface
  
  async execute(data: CreateCategoryDto) {
    return this.repository.create(data); // Through abstraction
  }
}
```

### ❌ DON'T: Create God Use Cases

```typescript
// ❌ BAD
export class CategoryUseCase {
  create() {}
  update() {}
  delete() {}
  getAll() {}
  getOne() {}
  // ... many more methods
}

// ✅ GOOD - One use case per operation
CreateCategoryUseCase
UpdateCategoryUseCase
DeleteCategoryUseCase
GetCategoriesUseCase
GetCategoryByIdUseCase
```

### ❌ DON'T: Skip Validation

```typescript
// ❌ BAD
async execute(id: string, data: UpdateCategoryDto) {
  return this.repository.update(id, data); // No validation
}

// ✅ GOOD
async execute(id: string, data: UpdateCategoryDto) {
  const exists = await this.findRepository.findOne(id);
  if (!exists) {
    throw new NotFoundException('Category not found');
  }
  return this.repository.update(id, data);
}
```

## 📋 Use Case Checklist

When creating a use case:

- [ ] Injectable decorator
- [ ] Single responsibility
- [ ] Depends on interfaces (not implementations)
- [ ] Contains business validation
- [ ] Returns domain entities
- [ ] Handles errors appropriately
- [ ] No direct database access
- [ ] No HTTP/framework-specific code
- [ ] Easy to test
- [ ] Clear, descriptive name

## 💡 Best Practices

### 1. One Use Case Per Operation
```typescript
// ✅ Each operation is separate
CreateProductUseCase
UpdateProductUseCase
DeleteProductUseCase
```

### 2. Inject Interfaces, Not Implementations
```typescript
constructor(
  private repository: ICreateProductRepository, // Interface
) {}
```

### 3. Validate Business Rules
```typescript
async execute(data: CreateOrderDto) {
  // Business validation
  if (data.items.length === 0) {
    throw new BadRequestException('Order must have at least one item');
  }
  
  // Continue with operation
}
```

### 4. Return Domain Entities
```typescript
async execute(id: string): Promise<ProductEntity> {
  return this.repository.findOne(id);
}
```

### 5. Handle Errors Explicitly
```typescript
const product = await this.repository.findOne(id);

if (!product) {
  throw new NotFoundException('Product not found');
}
```

## 🎯 Naming Conventions

| Operation | Use Case Name | Method |
|-----------|---------------|---------|
| Create | `Create{Entity}UseCase` | `execute(data: CreateDto)` |
| Update | `Update{Entity}UseCase` | `execute(id: string, data: UpdateDto)` |
| Delete | `Delete{Entity}UseCase` | `execute(id: string)` |
| Get All | `Get{Entities}UseCase` | `execute(query: PaginationDto)` |
| Get One | `Get{Entity}ByIdUseCase` | `execute(id: string)` |

---

**Next:** Learn about [07-DTOs-And-Validation.md](07-DTOs-And-Validation.md)

