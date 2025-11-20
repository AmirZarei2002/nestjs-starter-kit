# Project Structure Guide

Understanding the starter-kit project organization and file structure.

## 📁 Root Directory Structure

```
starter-kit/
├── docs/                    # Documentation files
├── docker/                  # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── logs/                    # Application logs
│   ├── combined.log
│   └── error.log
├── node_modules/            # Dependencies
├── prisma/                  # Database schema
│   └── schema.prisma
├── scripts/                 # Utility scripts
├── src/                     # Source code (main)
├── test/                    # E2E tests
├── tools/                   # Development tools
│   └── generate-module.ts
├── .env                     # Environment variables
├── .gitignore              
├── eslint.config.mjs        # ESLint configuration
├── nest-cli.json           # NestJS CLI config
├── package.json            
├── tsconfig.json           # TypeScript config
└── tsconfig.build.json
```

## 🎯 Source Directory (`src/`)

The `src/` directory contains all application code, organized by responsibility:

```
src/
├── modules/           # Feature modules (business domains)
├── common/           # Reusable utilities & helpers
├── shared/           # Application-level features
├── config/           # Configuration files
├── prisma/           # Database client & seeds
├── utils/            # General utilities
└── main.ts          # Application entry point
```

### Detailed Breakdown

#### 1. **`modules/` - Feature Modules**

Each module represents a business domain following Clean Architecture:

```
modules/
└── category/                    # Example module
    ├── application/             # Business logic layer
    │   ├── dtos/               # Data Transfer Objects
    │   │   ├── create-category.dto.ts
    │   │   └── update-category.dto.ts
    │   ├── use-cases/          # Business use cases
    │   │   ├── create-category.usecase.ts
    │   │   ├── update-category.usecase.ts
    │   │   ├── get-categories.usecase.ts
    │   │   ├── get-category-by-id.usecase.ts
    │   │   └── delete-category.usecase.ts
    │   └── index.ts            # Barrel export
    │
    ├── domain/                  # Domain layer
    │   ├── entities/           # Domain models
    │   │   └── category.entity.ts
    │   ├── interfaces/         # Contracts/Abstractions
    │   │   └── category.repository.interface.ts
    │   ├── mappers/            # Data transformation
    │   │   └── category.mapper.ts
    │   └── index.ts            # Barrel export
    │
    ├── infrastructure/          # Implementation layer
    │   └── prisma/
    │       ├── persistence/    # Repository implementations
    │       │   ├── create-category.repository.ts
    │       │   ├── update-category.repository.ts
    │       │   ├── get-categories.repository.ts
    │       │   ├── get-category-by-id.repository.ts
    │       │   └── delete-category.repository.ts
    │       ├── presentation/   # Controllers
    │       │   └── controllers/
    │       │       └── category.controller.ts
    │       ├── categories.seed.ts
    │       └── index.ts        # Barrel export
    │
    ├── category.module.ts       # Module definition
    └── index.ts                 # Main barrel export
```

**Key Principles:**
- **Application Layer**: Business logic, use cases, DTOs
- **Domain Layer**: Core business entities, interfaces, rules
- **Infrastructure Layer**: External concerns (DB, API, etc.)

#### 2. **`common/` - Shared Utilities**

Reusable code that doesn't depend on specific business logic:

```
common/
├── constants/          # Application constants
├── decorators/         # Custom decorators
├── dtos/              # Shared DTOs
│   └── pagination-query.dto.ts
├── exceptions/        # Custom exceptions
├── filters/           # Exception filters
├── guards/            # Auth/permission guards
├── interceptors/      # Request/response interceptors
├── middlewares/       # HTTP middlewares
├── transformers/      # Data transformers
├── types/             # Shared types
│   ├── paginated-result.type.ts
│   └── pagination-meta.type.ts
├── utils/             # Helper functions
│   ├── env.util.ts
│   └── paginate.util.ts
├── validators/        # Custom validators
└── index.ts          # Barrel export
```

**When to use `common/`:**
- Generic utilities used across multiple modules
- Framework-agnostic helpers
- No business logic dependencies

#### 3. **`shared/` - Application Features**

Application-specific features that span multiple modules:

```
shared/
├── cache/                      # Caching system
│   ├── cache.interceptor.ts
│   ├── cache.module.ts
│   ├── cache.service.ts
│   └── cached.decorator.ts
├── interceptors/               # App-level interceptors
│   └── logging.interceptor.ts
├── seeds/                      # Database seeds
├── services/                   # Shared services
│   └── custom-logger.service.ts
└── index.ts                   # Barrel export
```

**When to use `shared/`:**
- Features tied to this specific application
- Cross-cutting concerns (logging, caching)
- Application-specific implementations

#### 4. **`config/` - Configuration**

Application configuration files:

```
config/
├── interfaces/
│   └── cors-config.interface.ts
└── cors.config.ts
```

**Purpose:**
- Environment-based configuration
- Feature toggles
- Third-party service configs

#### 5. **`prisma/` - Database Layer**

Prisma-specific code:

```
prisma/
├── prisma.module.ts    # Prisma module
├── prisma.service.ts   # Prisma service
└── seed.ts            # Main seed orchestrator
```

**Note:** Module-specific seeds live in each module's infrastructure folder.

#### 6. **`utils/` - General Utilities**

Application-wide utility functions:

```
utils/
└── validation-options.ts
```

## 🏗️ Module Architecture Layers

### Layer 1: Domain (Core Business Logic)

```
domain/
├── entities/        # Business models
├── interfaces/      # Contracts
└── mappers/        # Data transformations
```

**Rules:**
- ❌ No external dependencies
- ❌ No framework imports
- ✅ Pure TypeScript/business logic
- ✅ Framework-agnostic

**Example:**
```typescript
// ✅ Good - Pure domain entity
export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}
```

### Layer 2: Application (Use Cases)

```
application/
├── dtos/           # Request/Response objects
└── use-cases/      # Business operations
```

**Rules:**
- ✅ Can depend on domain layer
- ✅ Contains business logic
- ❌ No infrastructure dependencies
- ✅ Framework-agnostic interfaces

**Example:**
```typescript
// ✅ Good - Clean use case
export class CreateCategoryUseCase {
  constructor(private repository: ICreateCategoryRepository) {}
  
  execute(data: CreateCategoryDto): Promise<CategoryEntity> {
    return this.repository.create(data);
  }
}
```

### Layer 3: Infrastructure (Implementation)

```
infrastructure/
├── prisma/
│   ├── persistence/    # Repository implementations
│   └── presentation/   # Controllers
```

**Rules:**
- ✅ Can depend on all layers
- ✅ Framework-specific code
- ✅ External service integrations
- ✅ Database implementations

**Example:**
```typescript
// ✅ Good - Infrastructure implementation
@Injectable()
export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private prisma: PrismaService) {}
  
  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({ data });
    return CategoryMapper.toEntity(category);
  }
}
```

## 📦 Dependency Flow

```
Infrastructure Layer
       ↓ depends on
Application Layer
       ↓ depends on
  Domain Layer
 (no dependencies)
```

**Key Rule:** Dependencies always point inward, never outward.

## 🎨 Naming Conventions

### Files
- **Entities:** `*.entity.ts` (e.g., `category.entity.ts`)
- **DTOs:** `*.dto.ts` (e.g., `create-category.dto.ts`)
- **Use Cases:** `*.usecase.ts` (e.g., `create-category.usecase.ts`)
- **Repositories:** `*.repository.ts` (e.g., `create-category.repository.ts`)
- **Controllers:** `*.controller.ts` (e.g., `category.controller.ts`)
- **Services:** `*.service.ts` (e.g., `cache.service.ts`)
- **Modules:** `*.module.ts` (e.g., `category.module.ts`)
- **Interfaces:** `*.interface.ts` (e.g., `category.repository.interface.ts`)
- **Mappers:** `*.mapper.ts` (e.g., `category.mapper.ts`)

### Classes
- **Entities:** `*Entity` (e.g., `CategoryEntity`)
- **DTOs:** `*Dto` (e.g., `CreateCategoryDto`)
- **Use Cases:** `*UseCase` (e.g., `CreateCategoryUseCase`)
- **Repositories:** `*Repository` (e.g., `CreateCategoryRepository`)
- **Controllers:** `*Controller` (e.g., `CategoryController`)
- **Services:** `*Service` (e.g., `CacheService`)
- **Modules:** `*Module` (e.g., `CategoryModule`)

### Interfaces
- **Prefix with `I`:** `I*Repository` (e.g., `ICreateCategoryRepository`)

## 📋 Barrel Exports (index.ts)

Each major folder has an `index.ts` file for clean imports:

```typescript
// modules/category/domain/index.ts
export * from './entities/category.entity';
export * from './interfaces/category.repository.interface';
export * from './mappers/category.mapper';
```

**Benefits:**
- Clean imports: `import { CategoryEntity } from '@category/domain'`
- Encapsulation: Control what's public
- Refactoring: Change internals without breaking imports

## 🔗 Import Path Aliases

Configured in `tsconfig.json`:

```typescript
// ❌ Bad - Absolute paths
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';

// ✅ Good - Path aliases
import { CategoryEntity } from '@category/domain';
```

**Available Aliases:**
- `@common/*` → `src/common/*`
- `@shared/*` → `src/shared/*`
- `@config/*` → `src/config/*`
- `@prisma/*` → `src/prisma/*`
- `@modules/*` → `src/modules/*`
- `@category/*` → `src/modules/category/*`

See [12-Import-Patterns.md](12-Import-Patterns.md) for details.

## 📊 File Organization Best Practices

### ✅ DO:
- Keep related files together
- Use barrel exports for public APIs
- Follow consistent naming conventions
- Separate concerns by layer
- One class per file

### ❌ DON'T:
- Mix business logic with infrastructure
- Create circular dependencies
- Put everything in one folder
- Use relative imports across modules
- Skip barrel exports

## 🎯 Quick Reference

| Need | Location | Example |
|------|----------|---------|
| New feature | `src/modules/{feature}/` | `category/` |
| Reusable utility | `src/common/utils/` | `paginate.util.ts` |
| App-wide feature | `src/shared/` | `cache/` |
| Custom decorator | `src/common/decorators/` | `user.decorator.ts` |
| Configuration | `src/config/` | `cors.config.ts` |
| Database seed | `src/modules/{feature}/infrastructure/` | `categories.seed.ts` |
| Shared DTO | `src/common/dtos/` | `pagination-query.dto.ts` |
| Shared type | `src/common/types/` | `paginated-result.type.ts` |

---

**Next:** Learn about [03-Architecture-Overview.md](03-Architecture-Overview.md)

