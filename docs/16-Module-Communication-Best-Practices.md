# Module Communication Best Practices

## Overview

This document explains the **correct way** for modules to communicate with each other in this NestJS application, following Clean Architecture and SOLID principles.

## ❌ What NOT to Do

### 1. Direct Import of Concrete Implementations

**BAD - Don't do this:**

```typescript
// ❌ ProductModule importing concrete Category implementation
import { GetCategoryByIdRepository } from '@modules/category/infrastructure';

@Module({
  providers: [
    {
      provide: CreateProductUseCase,
      inject: [CreateProductRepository, GetCategoryByIdRepository], // ❌ BAD
    },
  ],
})
export class ProductModule {}
```

**Why this is bad:**
- ❌ Violates module boundaries
- ❌ Creates tight coupling between modules  
- ❌ Product module now depends on Category's infrastructure layer
- ❌ Hard to test (can't easily mock)
- ❌ Changes to Category infrastructure break Product module
- ❌ Goes against Dependency Inversion Principle

## ✅ The Correct Pattern: Injection Tokens

### Step 1: Create Injection Tokens

Create tokens in the **domain layer** of the module you want to share:

```typescript:1:39:src/modules/category/domain/tokens/category.tokens.ts
/**
 * Injection tokens for Category module
 * These tokens are used for dependency injection to avoid direct coupling
 * between modules and allow for easier testing and flexibility
 */

export const CATEGORY_REPOSITORY_TOKENS = {
  /**
   * Token for IFindCategoryByIdRepository
   * Used when other modules need to find a category by ID
   */
  FIND_CATEGORY_BY_ID: Symbol('IFindCategoryByIdRepository'),

  /**
   * Token for IFindCategoriesRepository
   * Used when other modules need to find multiple categories
   */
  FIND_CATEGORIES: Symbol('IFindCategoriesRepository'),

  /**
   * Token for ICreateCategoryRepository
   * Used when other modules need to create categories
   */
  CREATE_CATEGORY: Symbol('ICreateCategoryRepository'),

  /**
   * Token for IUpdateCategoryRepository
   * Used when other modules need to update categories
   */
  UPDATE_CATEGORY: Symbol('IUpdateCategoryRepository'),

  /**
   * Token for IDeleteCategoryRepository
   * Used when other modules need to delete categories
   */
  DELETE_CATEGORY: Symbol('IDeleteCategoryRepository'),
} as const;
```

### Step 2: Export Tokens from Domain

```typescript:11:11:src/modules/category/domain/index.ts
export * from './tokens/category.tokens';
```

### Step 3: Provider Module Exports Token Binding

The module that **provides** the implementation exports the token:

```typescript
// category.module.ts
import { CATEGORY_REPOSITORY_TOKENS } from './domain';
import { GetCategoryByIdRepository } from './infrastructure';

@Module({
  exports: [
    // ✅ Export using token, not concrete class
    {
      provide: CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      useClass: GetCategoryByIdRepository,
    },
  ],
  providers: [
    GetCategoryByIdRepository,
    // ✅ Also provide internally for this module's use
    {
      provide: CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      useClass: GetCategoryByIdRepository,
    },
    // Other providers...
    {
      provide: UpdateCategoryUseCase,
      useFactory: (updateRepo, findOneRepo) =>
        new UpdateCategoryUseCase(updateRepo, findOneRepo),
      inject: [
        UpdateCategoryRepository,
        CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID, // ✅ Use token
      ],
    },
  ],
})
export class CategoryModule {}
```

### Step 4: Consumer Module Uses Token

The module that **consumes** the implementation uses the token:

```typescript
// product.module.ts
import { CategoryModule, CATEGORY_REPOSITORY_TOKENS } from '@modules/category';
import { IFindCategoryByIdRepository } from '@modules/category/domain'; // Interface for typing

@Module({
  imports: [
    CategoryModule, // ✅ Import the module
  ],
  providers: [
    {
      provide: CreateProductUseCase,
      useFactory: (
        createProductRepo: ICreateProductRepository,
        findCategoryByIdRepo: IFindCategoryByIdRepository, // ✅ Interface for type
      ) => new CreateProductUseCase(createProductRepo, findCategoryByIdRepo),
      inject: [
        CreateProductRepository,
        CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID, // ✅ Token for injection
      ],
    },
  ],
})
export class ProductModule {}
```

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Product Module                           │
│                                                                  │
│  Use Case:                                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │ CreateProductUseCase                             │          │
│  │                                                  │          │
│  │ constructor(                                     │          │
│  │   createRepo: ICreateProductRepository,         │          │
│  │   categoryRepo: IFindCategoryByIdRepository ────┼──────┐   │
│  │ )                                                │      │   │
│  └──────────────────────────────────────────────────┘      │   │
│                                                              │   │
│  Injection:                                                 │   │
│  inject: [                                                  │   │
│    CreateProductRepository,                                 │   │
│    CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID ─────────┼─┐ │
│  ]                                                          │ │ │
└─────────────────────────────────────────────────────────────┼─┼─┘
                                                              │ │
                        ┌─────────────────────────────────────┘ │
                        │ Uses Token (loose coupling)            │
                        │                                        │
┌───────────────────────▼───────────────────────────────────────▼─┐
│                      Category Module                             │
│                                                                  │
│  Exports:                                                        │
│  ┌────────────────────────────────────────────────────┐        │
│  │ {                                                  │        │
│  │   provide: CATEGORY_REPOSITORY_TOKENS              │        │
│  │             .FIND_CATEGORY_BY_ID,                  │        │
│  │   useClass: GetCategoryByIdRepository ◄────────────┼──┐     │
│  │ }                                                  │  │     │
│  └────────────────────────────────────────────────────┘  │     │
│                                                           │     │
│  Infrastructure:                                          │     │
│  ┌────────────────────────────────────────────────────┐  │     │
│  │ GetCategoryByIdRepository                          │◄─┘     │
│  │ implements IFindCategoryByIdRepository             │        │
│  └────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

## 🎯 Benefits of This Approach

### 1. **Loose Coupling**
- Modules depend on interfaces/tokens, not concrete implementations
- Category module can change its implementation without affecting Product module

### 2. **Testability**
```typescript
// Easy to mock in tests
const mockCategoryRepo: IFindCategoryByIdRepository = {
  findOne: jest.fn(),
};

const useCase = new CreateProductUseCase(
  mockProductRepo,
  mockCategoryRepo, // ✅ Easy to inject mock
);
```

### 3. **Flexibility**
```typescript
// Easy to swap implementations
{
  provide: CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
  useClass: RedisCategoryRepository, // ✅ Can switch to different implementation
}
```

### 4. **Follows SOLID Principles**
- **S**ingle Responsibility: Each module handles its own concerns
- **O**pen/Closed: Modules open for extension, closed for modification
- **L**iskov Substitution: Can substitute implementations via token
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions (interfaces), not concretions

## 📋 Quick Reference Checklist

When creating cross-module dependencies:

- [ ] ✅ Create injection token in domain layer
- [ ] ✅ Export token from domain/index.ts
- [ ] ✅ Provider module exports `{ provide: TOKEN, useClass: Implementation }`
- [ ] ✅ Consumer module imports only the MODULE and TOKEN
- [ ] ✅ Consumer module uses interface for typing, token for injection
- [ ] ❌ NEVER import concrete implementation from another module
- [ ] ❌ NEVER import from another module's infrastructure layer

## 🔍 What You CAN Import Across Modules

### ✅ **Domain Layer** (Always OK)
```typescript
// ✅ GOOD - Domain entities
import { CategoryEntity } from '@modules/category/domain';

// ✅ GOOD - Domain interfaces
import { IFindCategoryByIdRepository } from '@modules/category/domain';

// ✅ GOOD - Injection tokens
import { CATEGORY_REPOSITORY_TOKENS } from '@modules/category/domain';

// ✅ GOOD - DTOs (if needed)
import { CreateCategoryDto } from '@modules/category/application';
```

### ❌ **Infrastructure Layer** (NEVER)
```typescript
// ❌ BAD - Infrastructure implementations
import { GetCategoryByIdRepository } from '@modules/category/infrastructure';

// ❌ BAD - Prisma-specific code
import { CategoryPrismaMapper } from '@modules/category/infrastructure';

// ❌ BAD - Controllers
import { CategoryController } from '@modules/category/infrastructure';
```

### ⚠️ **Application Layer** (Use Carefully)
```typescript
// ⚠️ CAREFUL - Use cases (usually not needed across modules)
// If you need this, consider using events or a shared service instead
import { GetCategoryByIdUseCase } from '@modules/category/application';
```

## 🚀 Advanced: When to Create New Tokens

Create a new token when:

1. **Another module needs to use the functionality**
   ```typescript
   // Product module needs to find categories
   FIND_CATEGORY_BY_ID: Symbol('IFindCategoryByIdRepository')
   ```

2. **You want to swap implementations easily**
   ```typescript
   // Switch between database implementations
   CATEGORY_REPOSITORY: Symbol('ICategoryRepository')
   ```

3. **Testing requires easy mocking**
   ```typescript
   // Make testing easier with injectable dependencies
   CATEGORY_VALIDATOR: Symbol('ICategoryValidator')
   ```

## 📝 Real-World Example: Order Module Needs Product and Category

```typescript
// order.module.ts
import { ProductModule, PRODUCT_REPOSITORY_TOKENS } from '@modules/product';
import { CategoryModule, CATEGORY_REPOSITORY_TOKENS } from '@modules/category';
import { IFindProductByIdRepository } from '@modules/product/domain';
import { IFindCategoryByIdRepository } from '@modules/category/domain';

@Module({
  imports: [
    ProductModule,  // ✅ Import modules
    CategoryModule,
  ],
  providers: [
    {
      provide: CreateOrderUseCase,
      useFactory: (
        createOrderRepo: ICreateOrderRepository,
        findProductRepo: IFindProductByIdRepository,    // ✅ Type with interface
        findCategoryRepo: IFindCategoryByIdRepository,
      ) => new CreateOrderUseCase(createOrderRepo, findProductRepo, findCategoryRepo),
      inject: [
        CreateOrderRepository,
        PRODUCT_REPOSITORY_TOKENS.FIND_PRODUCT_BY_ID,      // ✅ Inject with token
        CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID,
      ],
    },
  ],
})
export class OrderModule {}
```

## 🎓 Summary

**The Golden Rule:**
> Modules should communicate through **interfaces** (for typing) and **tokens** (for injection), never through concrete implementations.

**Think of it like:**
- **Interface** = The contract (what methods are available)
- **Token** = The key (how to get the implementation)
- **Implementation** = The actual code (hidden behind the interface)

This approach keeps your modules **loosely coupled**, **highly testable**, and **easy to maintain**!

## 📚 Further Reading

- [NestJS Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Dependency Injection Best Practices](https://docs.nestjs.com/fundamentals/dependency-injection)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

