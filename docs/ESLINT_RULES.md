# ESLint Import Rules Guide

This document explains the ESLint rules configured to enforce clean architecture and consistent import patterns in the starter-kit project.

## 📋 Overview

We've configured ESLint to automatically enforce our modular architecture principles through import/export rules. These rules help maintain clean code, proper encapsulation, and consistent patterns across the codebase.

## 🚫 Restricted Patterns

### 1. **No `src/` Imports**

**Rule:** All imports must use path aliases instead of `src/` prefixed paths.

```typescript
// ❌ BAD - Will cause ESLint error
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';

// ✅ GOOD - Uses path aliases
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CategoryEntity } from '@category/domain';
```

**Error Message:**
```
Use path aliases (@common, @shared, @modules, etc.) instead of "src/" imports
```

### 2. **No Direct Infrastructure Imports**

**Rule:** Do not import directly from infrastructure layer across modules.

```typescript
// ❌ BAD - Direct infrastructure import
import { seedPermissions } from '../modules/permission/infrastructure/prisma/permissions.seed';
import { UserRepository } from '@user/infrastructure/prisma/persistence/user.repository';

// ✅ GOOD - Use public APIs through barrel exports
import { seedPermissions } from '@permission/seeds'; // if exposed
import { UserEntity } from '@user/domain';
```

**Error Messages:**
```
Do not import directly from infrastructure layer. Use barrel exports from application or domain layer.
Infrastructure imports should be internal to the module. Use public APIs through barrel exports.
```

### 3. **No Cross-Module Relative Imports**

**Rule:** Use path aliases for cross-module imports, not relative paths.

```typescript
// ❌ BAD - Relative path across modules
import { UserEntity } from '../../../modules/user/domain/entities/user.entity';
import { ProductService } from '../../modules/product/application/product.service';

// ✅ GOOD - Path aliases
import { UserEntity } from '@user/domain';
import { ProductService } from '@product/application';
```

**Error Message:**
```
Use path aliases (@modules/*, @category/*, etc.) for cross-module imports instead of relative paths
```

## ✅ Import Order Rules

Imports are automatically organized in the following order:

1. **Built-in** - Node.js built-in modules (`fs`, `path`, etc.)
2. **External** - npm packages (with `@nestjs/*` first)
3. **Internal** - Path aliases in order:
   - `@common/*`
   - `@shared/*`
   - `@config/*`
   - `@prisma/*`
   - `@modules/*`
   - Module-specific aliases (`@category/*`, `@user/*`, etc.)
4. **Parent** - Parent directory imports (`../`)
5. **Sibling** - Same directory imports (`./`)
6. **Index** - Index file imports

### Example of Correct Import Order:

```typescript
// 1. Built-in modules
import * as path from 'path';

// 2. External packages (@nestjs first)
import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

// 3. Internal path aliases
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { CustomLoggerService } from '@shared/services/custom-logger.service';
import { PrismaService } from '@prisma/prisma.service';
import { CategoryEntity } from '@category/domain';

// 4. Parent directory imports
import { BaseEntity } from '../base.entity';

// 5. Same directory imports
import { CreateCategoryDto } from './create-category.dto';
```

**Imports are sorted alphabetically within each group.**

## 🛠️ Additional Rules

### Import Quality Rules

- ✅ **No duplicate imports** - Same module imported twice
- ✅ **Imports at the top** - All imports must be at file top
- ✅ **Newline after imports** - One blank line after import block
- ✅ **TypeScript path resolution** - Recognizes `tsconfig.json` path mappings

## 🧪 Test Files Exception

Test files have relaxed rules:

```typescript
// In *.spec.ts or *.test.ts files
// All import restrictions are disabled for flexibility in testing
```

## 🔧 Running ESLint

### Check for Issues:
```bash
npm run lint
```

### Auto-fix Issues:
```bash
npm run lint -- --fix
```

Most import order issues are auto-fixable. However, restricted import patterns must be manually updated to use proper path aliases.

## 📊 Common Violations & Fixes

### Violation 1: Using `src/` paths

```typescript
// ❌ Error
import { CreateCategoryDto } from 'src/modules/category/application/dtos/create-category.dto';

// ✅ Fix
import { CreateCategoryDto } from '@category/application';
```

### Violation 2: Importing from infrastructure

```typescript
// ❌ Error
import { UserRepository } from '@user/infrastructure/prisma/persistence/user.repository';

// ✅ Fix - Use domain interfaces instead
import { IUserRepository } from '@user/domain';
```

### Violation 3: Import order

```typescript
// ❌ Error - Wrong order
import { CategoryEntity } from '@category/domain';
import { Injectable } from '@nestjs/common';

// ✅ Fix - NestJS first, then internal
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '@category/domain';
```

### Violation 4: Multiple newlines between imports

```typescript
// ❌ Error
import { Module } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';

import { CreateCategoryUseCase } from './application';

// ✅ Fix - No empty lines between imports
import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCategoryUseCase } from './application';
```

## 🎯 Benefits

1. **Consistency** - All developers follow the same patterns
2. **Readability** - Predictable import organization
3. **Encapsulation** - Prevents breaking architectural boundaries
4. **Refactoring** - Easier to restructure internal implementations
5. **Automation** - Auto-fix handles most formatting issues

## 📝 Configuration Files

### ESLint Config: `eslint.config.mjs`
Contains all rule definitions

### TypeScript Config: `tsconfig.json`
Contains path alias mappings

```json
{
  "compilerOptions": {
    "paths": {
      "@common/*": ["./src/common/*"],
      "@shared/*": ["./src/shared/*"],
      "@config/*": ["./src/config/*"],
      "@prisma/*": ["./src/prisma/*"],
      "@modules/*": ["./src/modules/*"],
      "@category/*": ["./src/modules/category/*"]
    }
  }
}
```

## 🚀 For New Modules

When creating a new module (e.g., `product`):

1. **Add path alias to `tsconfig.json`:**
```json
"@product/*": ["./src/modules/product/*"]
```

2. **Create barrel exports** (`index.ts` files)

3. **Imports will automatically be validated** by ESLint

## 💡 Tips

- **Auto-fix on save**: Configure your IDE to run ESLint auto-fix on save
- **Pre-commit hooks**: Consider adding ESLint to pre-commit hooks
- **CI/CD**: Add `npm run lint` to your CI pipeline
- **New team members**: Share this guide for quick onboarding
