# Import Patterns and Path Aliases

Complete guide to import patterns, path aliases, and barrel exports in starter-kit.

## 🎯 Overview

starter-kit uses **path aliases** and **barrel exports** to create clean, maintainable imports. This eliminates long relative paths and provides clear module boundaries.

## 📋 Configured Path Aliases

Defined in `tsconfig.json`:

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
      "@product/*": ["./src/modules/product/*"]
    }
  }
}
```

## 🔄 Before & After

### Without Path Aliases (❌ Bad)

```typescript
import { CreateCategoryDto } from '../../../modules/category/application/dtos/create-category.dto';
import { CategoryEntity } from '../../../modules/category/domain/entities/category.entity';
import { ICreateCategoryRepository } from '../../../modules/category/domain/interfaces/category.repository.interface';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
```

### With Path Aliases (✅ Good)

```typescript
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CreateCategoryDto } from '@category/application';
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
```

## 📦 Barrel Exports

Barrel exports (using `index.ts` files) group related exports and provide a clean public API.

### Module Structure with Barrels

```
src/modules/category/
├── domain/
│   ├── entities/
│   │   └── category.entity.ts
│   ├── interfaces/
│   │   └── category.repository.interface.ts
│   ├── mappers/
│   │   └── category.mapper.ts
│   └── index.ts  ← Barrel export
├── application/
│   ├── dtos/
│   │   ├── create-category.dto.ts
│   │   └── update-category.dto.ts
│   ├── use-cases/
│   │   ├── create-category.usecase.ts
│   │   └── ...
│   └── index.ts  ← Barrel export
├── infrastructure/
│   └── index.ts  ← Barrel export
└── index.ts  ← Main barrel export
```

### Example Barrel Exports

**Domain Layer (`domain/index.ts`):**
```typescript
// Entities
export * from './entities/category.entity';

// Interfaces
export * from './interfaces/category.repository.interface';

// Mappers
export * from './mappers/category.mapper';
```

**Application Layer (`application/index.ts`):**
```typescript
// DTOs
export * from './dtos/create-category.dto';
export * from './dtos/update-category.dto';

// Use Cases
export * from './use-cases/create-category.usecase';
export * from './use-cases/update-category.usecase';
export * from './use-cases/get-categories.usecase';
export * from './use-cases/get-category-by-id.usecase';
export * from './use-cases/delete-category.usecase';
```

**Infrastructure Layer (`infrastructure/index.ts`):**
```typescript
// Repositories
export * from './prisma/persistence/create-category.repository';
export * from './prisma/persistence/update-category.repository';
export * from './prisma/persistence/get-categories.repository';
export * from './prisma/persistence/get-category-by-id.repository';
export * from './prisma/persistence/delete-category.repository';

// Controllers
export * from './prisma/presentation/controllers/category.controller';
```

**Module Main (`index.ts`):**
```typescript
// Module
export * from './category.module';

// Re-export application layer (public API)
export * from './application';

// Re-export domain layer (public API)
export * from './domain';

// Infrastructure typically NOT exported
```

## 🎨 Import Patterns by Context

### 1. Within Same Directory

Use relative imports:

```typescript
// Same directory
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';
```

### 2. Within Same Layer (Different Folder)

Use relative imports:

```typescript
// application/use-cases/create-category.usecase.ts
import { CreateCategoryDto } from '../dtos/create-category.dto';
```

### 3. Between Layers (Same Module)

Use barrel exports with path alias:

```typescript
// infrastructure → domain
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';

// infrastructure → application
import { CreateCategoryDto } from '@category/application';

// application → domain
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
```

### 4. Between Modules

Use path aliases:

```typescript
// product module → category module
import { CategoryEntity } from '@category/domain';

// any module → common
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';

// any module → shared
import { CacheService } from '@shared/cache/cache.service';
```

### 5. Controllers

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import {
  CreateCategoryDto,
  CreateCategoryUseCase,
  GetCategoriesUseCase,
} from '@category/application';
import { CacheInterceptor } from '@shared/cache/cache.interceptor';
```

### 6. Use Cases

```typescript
import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
import { CreateCategoryDto } from '../dtos/create-category.dto';
```

### 7. Repositories

```typescript
import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository, CategoryMapper } from '@category/domain';
import { CreateCategoryDto } from '@category/application';
import { PrismaService } from '@prisma/prisma.service';
```

## 📏 Import Order

ESLint automatically enforces this order:

```typescript
// 1. Built-in Node.js modules
import * as path from 'path';
import * as fs from 'fs';

// 2. External packages (@nestjs first)
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// 3. Internal path aliases (alphabetically)
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CustomLoggerService } from '@shared/services/custom-logger.service';
import { PrismaService } from '@prisma/prisma.service';
import { CategoryEntity } from '@category/domain';
import { ProductEntity } from '@product/domain';

// 4. Parent directory imports
import { BaseEntity } from '../base.entity';

// 5. Same directory imports
import { CreateCategoryDto } from './create-category.dto';
```

## 🚫 Anti-Patterns to Avoid

### ❌ DON'T: Use `src/` Paths

```typescript
// ❌ BAD
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';

// ✅ GOOD
import { CategoryEntity } from '@category/domain';
```

### ❌ DON'T: Import from Infrastructure

```typescript
// ❌ BAD - Direct infrastructure import
import { CreateCategoryRepository } from '@category/infrastructure/prisma/persistence/create-category.repository';

// ✅ GOOD - Use interface from domain
import { ICreateCategoryRepository } from '@category/domain';
```

### ❌ DON'T: Use Deep Relative Paths Across Modules

```typescript
// ❌ BAD
import { UserEntity } from '../../../user/domain/entities/user.entity';

// ✅ GOOD
import { UserEntity } from '@user/domain';
```

### ❌ DON'T: Mix Import Styles

```typescript
// ❌ BAD - Inconsistent
import { CategoryEntity } from '@category/domain';
import { ProductEntity } from '../../../product/domain/entities/product.entity';

// ✅ GOOD - Consistent
import { CategoryEntity } from '@category/domain';
import { ProductEntity } from '@product/domain';
```

## ✅ Best Practices

### 1. Add Path Alias for New Modules

When creating a new module, add its alias to `tsconfig.json`:

```json
{
  "paths": {
    "@order/*": ["./src/modules/order/*"]
  }
}
```

### 2. Create Barrel Exports

Always create `index.ts` files for layers:

```typescript
// domain/index.ts
export * from './entities/order.entity';
export * from './interfaces/order.repository.interface';
```

### 3. Use Specific Imports When Needed

```typescript
// ✅ Specific import
import { CategoryEntity } from '@category/domain/entities/category.entity';

// ✅ Barrel import (preferred if available)
import { CategoryEntity } from '@category/domain';
```

### 4. Group Related Imports

```typescript
// Group by source
import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateCategoryUseCase,
} from '@category/application';
```

### 5. Restart TypeScript Server

After changing `tsconfig.json`:
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 🧪 Testing Imports

```typescript
// Test files can use same patterns
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryUseCase } from '@category/application';
import { ICreateCategoryRepository } from '@category/domain';
```

## 🎯 Quick Reference

### Available Aliases

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@common/*` | `src/common/*` | Utilities, shared DTOs |
| `@shared/*` | `src/shared/*` | App-level features |
| `@config/*` | `src/config/*` | Configuration files |
| `@prisma/*` | `src/prisma/*` | Database client |
| `@modules/*` | `src/modules/*` | All modules |
| `@category/*` | `src/modules/category/*` | Category module |
| `@product/*` | `src/modules/product/*` | Product module |

### Import Hierarchy

```
Infrastructure Layer
  ↓ can import
Application Layer
  ↓ can import
Domain Layer
(imports nothing from other layers)
```

### Import Rules

- ✅ Infrastructure → Application/Domain
- ✅ Application → Domain
- ❌ Domain → Application/Infrastructure
- ❌ Application → Infrastructure
- ✅ Any → Common/Shared
- ❌ Common/Shared → Modules

## 🔧 Adding New Module Alias

1. Add to `tsconfig.json`:
```json
"@order/*": ["./src/modules/order/*"]
```

2. Create barrel exports (`index.ts` files)

3. Restart TypeScript server

4. Use in imports:
```typescript
import { OrderEntity } from '@order/domain';
```

## 📚 Related Documentation

- [ESLINT_RULES.md](ESLINT_RULES.md) - Import linting rules
- [.eslintrc-quick-reference.md](.eslintrc-quick-reference.md) - Quick fixes
- [02-Project-Structure.md](02-Project-Structure.md) - Project layout

---

**Next:** Learn about [13-Testing-Guide.md](13-Testing-Guide.md)

