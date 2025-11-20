# Architecture Overview

Understanding the Clean Architecture principles and patterns used in starter-kit.

## 🎯 Architecture Philosophy

starter-kit follows **Clean Architecture** (also known as Hexagonal/Onion Architecture) with these core principles:

1. **Independence**: Business logic independent of frameworks, UI, databases
2. **Testability**: Business logic easily testable
3. **Flexibility**: Easy to swap implementations
4. **Maintainability**: Clear separation of concerns

## 🏛️ The Three Layers

```
┌─────────────────────────────────────────┐
│     Infrastructure Layer (Outside)       │
│  (Controllers, Repositories, External)   │
│  ┌───────────────────────────────────┐  │
│  │    Application Layer (Middle)      │  │
│  │    (Use Cases, DTOs, Workflows)    │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Domain Layer (Core)       │  │  │
│  │  │  (Entities, Interfaces)     │  │  │
│  │  │    ▲ No Dependencies ▲      │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Layer 1: Domain (Core Business Logic)

**Location:** `src/modules/{module}/domain/`

**Purpose:** Contains the heart of your business logic

**Contains:**
- **Entities**: Core business objects
- **Interfaces**: Contracts for repositories
- **Mappers**: Transform data between layers

**Rules:**
- ❌ NO external dependencies
- ❌ NO framework code (NestJS, Express, etc.)
- ❌ NO database code
- ✅ Pure TypeScript/JavaScript
- ✅ Framework-agnostic

**Example - Domain Entity:**
```typescript
// domain/entities/category.entity.ts
export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
  
  // Business logic methods can go here
  isActive(): boolean {
    return true; // Business rule
  }
}
```

**Example - Domain Interface:**
```typescript
// domain/interfaces/category.repository.interface.ts
export interface ICreateCategoryRepository {
  create(data: {
    name: string;
    description?: string;
  }): Promise<CategoryEntity | null>;
}
```

### Layer 2: Application (Use Cases)

**Location:** `src/modules/{module}/application/`

**Purpose:** Orchestrates business workflows

**Contains:**
- **Use Cases**: Business operations/workflows
- **DTOs**: Data transfer objects for input/output

**Rules:**
- ✅ Can depend on Domain layer
- ✅ Contains business workflows
- ❌ NO infrastructure dependencies
- ❌ NO direct database access
- ✅ Uses interfaces from Domain

**Example - Use Case:**
```typescript
// application/use-cases/create-category.usecase.ts
import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository } from '@category/domain';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly createCategoryRepository: ICreateCategoryRepository,
  ) {}

  async execute(data: CreateCategoryDto): Promise<CategoryEntity | null> {
    // Business logic here
    return await this.createCategoryRepository.create(data);
  }
}
```

**Example - DTO:**
```typescript
// application/dtos/create-category.dto.ts
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
```

### Layer 3: Infrastructure (Implementation Details)

**Location:** `src/modules/{module}/infrastructure/`

**Purpose:** Implements interfaces and handles external concerns

**Contains:**
- **Repositories**: Database implementations
- **Controllers**: HTTP endpoints
- **External Services**: Third-party integrations

**Rules:**
- ✅ Can depend on ALL layers
- ✅ Framework-specific code (NestJS, Prisma, etc.)
- ✅ Implements interfaces from Domain
- ✅ Handles external communication

**Example - Repository Implementation:**
```typescript
// infrastructure/prisma/persistence/create-category.repository.ts
import { Injectable } from '@nestjs/common';
import { CategoryEntity, ICreateCategoryRepository, CategoryMapper } from '@category/domain';
import { CreateCategoryDto } from '@category/application';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({ data });
    return CategoryMapper.toEntity(category);
  }
}
```

**Example - Controller:**
```typescript
// infrastructure/prisma/presentation/controllers/category.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto, CreateCategoryUseCase } from '@category/application';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(data);
  }
}
```

## 🔄 Data Flow

### Request Flow (Top to Bottom)

```
1. HTTP Request
        ↓
2. Controller (Infrastructure)
        ↓
3. Use Case (Application)
        ↓
4. Repository Interface (Domain)
        ↓
5. Repository Implementation (Infrastructure)
        ↓
6. Database
```

### Response Flow (Bottom to Top)

```
1. Database
        ↓
2. Repository Implementation
        ↓
3. Mapper (converts to Entity)
        ↓
4. Use Case
        ↓
5. Controller
        ↓
6. HTTP Response
```

### Complete Example

```typescript
// 1. User makes POST request to /api/v1/categories
{
  "name": "Electronics",
  "description": "Electronic products"
}

// 2. Controller receives request
@Post()
create(@Body() data: CreateCategoryDto) {
  return this.createCategoryUseCase.execute(data);
}

// 3. Use Case processes business logic
async execute(data: CreateCategoryDto): Promise<CategoryEntity> {
  // Could add business rules here
  // e.g., check for duplicates, validate business constraints
  return await this.createCategoryRepository.create(data);
}

// 4. Repository saves to database
async create(data: CreateCategoryDto): Promise<CategoryEntity> {
  const category = await this.prisma.category.create({ data });
  return CategoryMapper.toEntity(category);
}

// 5. Mapper converts Prisma model to Domain Entity
static toEntity(category: Category): CategoryEntity {
  return new CategoryEntity(
    category.id,
    category.name,
    category.description ?? '',
    category.createdAt,
    category.updatedAt,
  );
}

// 6. Response sent back to client
{
  "id": "uuid-here",
  "name": "Electronics",
  "description": "Electronic products",
  "createdAt": "2025-11-20T...",
  "updatedAt": "2025-11-20T..."
}
```

## 🎨 Design Patterns

### 1. Repository Pattern

**Purpose:** Abstract data access logic

**Benefits:**
- Swap database implementations easily
- Test business logic without database
- Centralize data access logic

```typescript
// Domain defines contract
export interface ICreateCategoryRepository {
  create(data: any): Promise<CategoryEntity>;
}

// Infrastructure implements
export class CreateCategoryRepository implements ICreateCategoryRepository {
  // Prisma implementation
}

// Could easily swap to MongoDB, MySQL, etc.
export class CreateCategoryMongoRepository implements ICreateCategoryRepository {
  // MongoDB implementation
}
```

### 2. Use Case Pattern

**Purpose:** Encapsulate business operations

**Benefits:**
- Single responsibility per use case
- Reusable business logic
- Easy to test

```typescript
// Each operation is a separate use case
CreateCategoryUseCase
UpdateCategoryUseCase
DeleteCategoryUseCase
GetCategoriesUseCase
GetCategoryByIdUseCase
```

### 3. Mapper Pattern

**Purpose:** Transform data between layers

**Benefits:**
- Decouple layers
- Keep domain pure
- Handle nullability/defaults

```typescript
export class CategoryMapper {
  static toEntity(prismaModel: Category): CategoryEntity {
    return new CategoryEntity(
      prismaModel.id,
      prismaModel.name,
      prismaModel.description ?? '', // Handle nullable
      prismaModel.createdAt,
      prismaModel.updatedAt,
    );
  }
  
  static toDTO(entity: CategoryEntity): CategoryResponseDto {
    // Transform if needed
  }
}
```

### 4. Dependency Injection

**Purpose:** Invert dependencies

**Benefits:**
- Loose coupling
- Easy testing (mock dependencies)
- Flexible implementations

```typescript
@Module({
  providers: [
    // Provide implementation
    CreateCategoryRepository,
    
    // Inject into use case
    {
      provide: CreateCategoryUseCase,
      useFactory: (repo: ICreateCategoryRepository) =>
        new CreateCategoryUseCase(repo),
      inject: [CreateCategoryRepository],
    },
  ],
})
export class CategoryModule {}
```

## ✅ Benefits of This Architecture

### 1. **Testability**
```typescript
// Easy to mock repositories for testing
const mockRepository = {
  create: jest.fn().mockResolvedValue(mockEntity),
};

const useCase = new CreateCategoryUseCase(mockRepository);
// Test business logic without database
```

### 2. **Flexibility**
```typescript
// Swap implementations without changing business logic
// From Prisma...
CreateCategoryPrismaRepository

// ...to MongoDB
CreateCategoryMongoRepository

// ...to In-Memory (for testing)
CreateCategoryInMemoryRepository
```

### 3. **Maintainability**
```typescript
// Clear where to put new code:
// - Business rule? → Domain/Use Case
// - New endpoint? → Controller
// - Different DB? → New Repository
```

### 4. **Independence**
```typescript
// Business logic doesn't know about:
// - Which database you use
// - Which framework you use
// - How data is received (HTTP, GraphQL, gRPC)
```

## 🚫 Common Anti-Patterns to Avoid

### ❌ Business Logic in Controllers
```typescript
// ❌ BAD
@Post()
async create(@Body() data: CreateCategoryDto) {
  // Business logic in controller
  if (await this.prisma.category.findFirst({ where: { name: data.name } })) {
    throw new BadRequestException('Category exists');
  }
  return this.prisma.category.create({ data });
}

// ✅ GOOD
@Post()
create(@Body() data: CreateCategoryDto) {
  return this.createCategoryUseCase.execute(data);
}
```

### ❌ Direct Database Access in Use Cases
```typescript
// ❌ BAD
export class CreateCategoryUseCase {
  constructor(private prisma: PrismaService) {} // Direct dependency
  
  async execute(data: CreateCategoryDto) {
    return this.prisma.category.create({ data }); // Direct access
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

### ❌ Framework Dependencies in Domain
```typescript
// ❌ BAD - NestJS decorator in domain
export class CategoryEntity {
  @ApiProperty() // Framework code in domain
  id: string;
}

// ✅ GOOD - Pure domain
export class CategoryEntity {
  constructor(
    public readonly id: string,
  ) {}
}
```

## 📊 Architecture Decision Records

### Why Three Layers?
- **Domain**: Business rules change rarely
- **Application**: Workflows change moderately
- **Infrastructure**: Technology changes frequently

### Why Separate Use Cases?
- Single Responsibility Principle
- Easy to test each operation
- Clear boundaries
- Reusable across different interfaces (HTTP, CLI, GraphQL)

### Why Mappers?
- Keep domain entities clean
- Handle framework-specific transformations
- Manage nullable/optional fields
- Decouple database models from business entities

## 🎯 Quick Decision Guide

**Where should this code go?**

| Code Type | Layer | Example |
|-----------|-------|---------|
| Business rule | Domain/Application | "Name must be unique" |
| Data validation | Application (DTO) | `@IsString()` |
| Database query | Infrastructure | `prisma.category.create()` |
| HTTP endpoint | Infrastructure | `@Post()` |
| Business entity | Domain | `CategoryEntity` |
| Request/Response | Application | `CreateCategoryDto` |
| External API call | Infrastructure | `axios.post()` |

---

**Next:** Learn to [04-Module-Creation-Guide.md](04-Module-Creation-Guide.md)

