# Best Practices and Coding Standards

Comprehensive guide to coding standards and best practices for starter-kit.

## 🎯 Core Principles

1. **Clean Architecture**: Maintain layer separation
2. **Single Responsibility**: One class, one purpose
3. **DRY**: Don't Repeat Yourself
4. **SOLID**: Follow SOLID principles
5. **Type Safety**: Leverage TypeScript fully
6. **Testability**: Write testable code

## 📐 Architecture Best Practices

### 1. Layer Separation

**DO:**
```typescript
// ✅ Use case depends on interface
export class CreateProductUseCase {
  constructor(private repository: ICreateProductRepository) {}
}

// ✅ Repository implements interface
export class CreateProductRepository implements ICreateProductRepository {
  constructor(private prisma: PrismaService) {}
}
```

**DON'T:**
```typescript
// ❌ Use case depends directly on implementation
export class CreateProductUseCase {
  constructor(private repository: CreateProductRepository) {}
}

// ❌ Direct database access in use case
export class CreateProductUseCase {
  constructor(private prisma: PrismaService) {}
  
  execute(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }
}
```

### 2. Dependency Direction

**Rule:** Dependencies always point inward

```
Infrastructure → Application → Domain
     ✅            ✅           ❌ (no dependencies)
```

**DO:**
```typescript
// ✅ Infrastructure depends on Domain
import { ICreateProductRepository, ProductEntity } from '@product/domain';

export class CreateProductRepository implements ICreateProductRepository {
  async create(data: any): Promise<ProductEntity> {
    // ...
  }
}
```

**DON'T:**
```typescript
// ❌ Domain depends on Infrastructure
import { PrismaService } from '@prisma/prisma.service';

export class ProductEntity {
  constructor(private prisma: PrismaService) {} // Wrong!
}
```

### 3. One Use Case Per Operation

**DO:**
```typescript
// ✅ Separate use cases
CreateProductUseCase
UpdateProductUseCase
DeleteProductUseCase
GetProductsUseCase
GetProductByIdUseCase
```

**DON'T:**
```typescript
// ❌ God class
export class ProductUseCase {
  create() {}
  update() {}
  delete() {}
  findAll() {}
  findOne() {}
  // ... 20 more methods
}
```

## 📝 Naming Conventions

### Files

```typescript
// Entities
product.entity.ts

// DTOs
create-product.dto.ts
update-product.dto.ts

// Use Cases
create-product.usecase.ts

// Repositories
create-product.repository.ts

// Controllers
product.controller.ts

// Services
product.service.ts

// Interfaces
product.repository.interface.ts

// Mappers
product.mapper.ts

// Guards
jwt-auth.guard.ts

// Decorators
current-user.decorator.ts
```

### Classes

```typescript
// Entities
ProductEntity
CategoryEntity

// DTOs
CreateProductDto
UpdateProductDto

// Use Cases
CreateProductUseCase
GetProductsUseCase

// Repositories
CreateProductRepository
GetProductsRepository

// Controllers
ProductController

// Services
CacheService
LoggerService

// Interfaces (prefix with I)
ICreateProductRepository
IFindProductRepository

// Mappers
ProductMapper

// Guards
JwtAuthGuard

// Decorators
CurrentUser
Public
```

### Variables and Methods

```typescript
// camelCase for variables and methods
const productId = '123';
const isActive = true;

async findById(id: string) {}
async createProduct(data: CreateProductDto) {}

// PascalCase for classes and types
class ProductEntity {}
type PaginatedResult<T> = {};

// UPPER_SNAKE_CASE for constants
const MAX_PAGE_SIZE = 100;
const DEFAULT_CACHE_TTL = 60;
```

## 🎨 Code Style

### Import Organization

```typescript
// 1. External packages (NestJS first)
import { Injectable, NotFoundException } from '@nestjs/common';

// 2. Internal aliases (alphabetically)
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';
import { PrismaService } from '@prisma/prisma.service';
import { ProductEntity, ICreateProductRepository } from '@product/domain';

// 3. Relative imports (parent first, then same directory)
import { BaseEntity } from '../base.entity';
import { CreateProductDto } from './create-product.dto';
```

### TypeScript Best Practices

**DO:**
```typescript
// ✅ Explicit types
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ✅ Readonly for immutability
export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

// ✅ Use interfaces for contracts
interface IProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
}

// ✅ Use enums for fixed values
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
}
```

**DON'T:**
```typescript
// ❌ Implicit any
function calculateTotal(price, quantity) {
  return price * quantity;
}

// ❌ Mutable public properties
export class ProductEntity {
  public name: string;
}

// ❌ String literals for fixed values
const status = 'pending'; // Use enum instead
```

### Async/Await

**DO:**
```typescript
// ✅ Use async/await
async function fetchProduct(id: string): Promise<ProductEntity> {
  try {
    const product = await this.repository.findOne(id);
    return product;
  } catch (error) {
    throw new NotFoundException('Product not found');
  }
}

// ✅ Handle errors
async execute(id: string): Promise<ProductEntity> {
  const product = await this.repository.findOne(id);
  
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  
  return product;
}
```

**DON'T:**
```typescript
// ❌ Mixing promises and async/await
async function fetchProduct(id: string) {
  return this.repository.findOne(id).then(product => {
    return product;
  });
}

// ❌ Not handling errors
async execute(id: string) {
  return await this.repository.findOne(id); // What if null?
}
```

## ✅ Validation Best Practices

### DTOs

**DO:**
```typescript
// ✅ Complete validation
export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
```

**DON'T:**
```typescript
// ❌ Missing validation
export class CreateProductDto {
  name: string; // No decorators
  price: number; // No validation
  description?: string;
}
```

### Business Validation

**DO:**
```typescript
// ✅ Validate in use case
export class CreateOrderUseCase {
  async execute(data: CreateOrderDto): Promise<OrderEntity> {
    // Business validation
    if (data.items.length === 0) {
      throw new BadRequestException('Order must have items');
    }
    
    for (const item of data.items) {
      const product = await this.productRepository.findOne(item.productId);
      
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
    }
    
    return this.repository.create(data);
  }
}
```

## 🔒 Security Best Practices

### 1. Input Validation

```typescript
// Always validate and sanitize input
@Post()
create(@Body() data: CreateProductDto) {
  // DTO validation happens automatically
  return this.useCase.execute(data);
}
```

### 2. Authentication & Authorization

```typescript
// Protect routes by default
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  // Protected endpoints
  
  // Make specific routes public
  @Public()
  @Get()
  findAll() {}
}
```

### 3. Sensitive Data

```typescript
// ❌ Don't expose passwords
export class UserEntity {
  password: string; // Wrong!
}

// ✅ Exclude sensitive fields
export class UserResponseDto {
  id: string;
  email: string;
  // password excluded
}
```

## 🧪 Testing Best Practices

### Unit Tests

```typescript
describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<ICreateProductRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
    };
    
    useCase = new CreateProductUseCase(mockRepository);
  });

  it('should create a product', async () => {
    const dto = { name: 'Test', price: 99.99 };
    const expectedProduct = new ProductEntity('id', 'Test', 99.99);
    
    mockRepository.create.mockResolvedValue(expectedProduct);
    
    const result = await useCase.execute(dto);
    
    expect(result).toEqual(expectedProduct);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});
```

### Test Coverage

- ✅ Test use cases thoroughly
- ✅ Test validation logic
- ✅ Test error handling
- ✅ Test edge cases
- ❌ Don't test framework code
- ❌ Don't test third-party libraries

## 📊 Performance Best Practices

### 1. Database Queries

```typescript
// ✅ Use pagination
async findAll(query: PaginationQueryDto) {
  return paginate(
    this.prisma.product,
    query,
    ProductMapper.toEntity,
  );
}

// ✅ Select only needed fields
const product = await this.prisma.product.findUnique({
  where: { id },
  select: { id: true, name: true, price: true },
});

// ✅ Use indexes (in schema.prisma)
model Product {
  name String @unique
  categoryId String
  
  @@index([categoryId])
}
```

### 2. Caching

```typescript
// ✅ Cache expensive operations
@Get()
@UseInterceptors(CacheInterceptor)
findAll(@Query() query: PaginationQueryDto) {
  return this.useCase.execute(query);
}
```

### 3. Async Operations

```typescript
// ✅ Parallel execution
const [products, categories] = await Promise.all([
  this.productRepository.findAll(),
  this.categoryRepository.findAll(),
]);

// ❌ Sequential (slower)
const products = await this.productRepository.findAll();
const categories = await this.categoryRepository.findAll();
```

## 🗂️ File Organization

### Module Structure

```
src/modules/product/
├── domain/              # Core business
│   ├── entities/
│   ├── interfaces/
│   ├── mappers/
│   └── index.ts
├── application/         # Use cases
│   ├── dtos/
│   ├── use-cases/
│   └── index.ts
├── infrastructure/      # Implementation
│   └── prisma/
│       ├── persistence/
│       ├── presentation/
│       └── index.ts
├── product.module.ts
└── index.ts
```

## 📋 Code Review Checklist

### Architecture
- [ ] Follows clean architecture principles
- [ ] Proper layer separation
- [ ] Dependencies point inward
- [ ] Single responsibility per class

### Code Quality
- [ ] Type-safe (no `any` types)
- [ ] Proper error handling
- [ ] Input validation
- [ ] Clear naming
- [ ] No code duplication

### Imports
- [ ] Uses path aliases
- [ ] Proper import order
- [ ] No circular dependencies
- [ ] No infrastructure imports in domain

### Testing
- [ ] Unit tests written
- [ ] Edge cases covered
- [ ] Mocks used properly
- [ ] Good test coverage

### Documentation
- [ ] JSDoc comments for public APIs
- [ ] README updated if needed
- [ ] Complex logic explained

## 🚫 Common Anti-Patterns

### 1. God Classes

```typescript
// ❌ Class doing too much
export class ProductService {
  create() {}
  update() {}
  delete() {}
  findAll() {}
  calculateDiscount() {}
  generateReport() {}
  sendEmail() {}
  // ... 20 more methods
}
```

### 2. Circular Dependencies

```typescript
// ❌ A imports B, B imports A
// product.service.ts
import { CategoryService } from './category.service';

// category.service.ts
import { ProductService } from './product.service';
```

### 3. Magic Numbers/Strings

```typescript
// ❌ Magic values
if (user.role === 'admin') {}
if (product.stock < 5) {}

// ✅ Named constants
const ADMIN_ROLE = 'admin';
const LOW_STOCK_THRESHOLD = 5;

if (user.role === ADMIN_ROLE) {}
if (product.stock < LOW_STOCK_THRESHOLD) {}
```

## 💡 Pro Tips

1. **Use ESLint**: Run `npm run lint` frequently
2. **Format Code**: Use Prettier (`npm run format`)
3. **Type Everything**: Avoid `any` types
4. **Write Tests**: Aim for >80% coverage
5. **Review PRs**: Learn from code reviews
6. **Document Complex Logic**: Future you will thank you
7. **Keep Functions Small**: <50 lines ideally
8. **Use Meaningful Names**: `getUserById` not `getData`
9. **Handle Errors**: Don't swallow exceptions
10. **Keep Learning**: Read NestJS docs, Clean Code book

## 📚 Recommended Reading

- **Clean Architecture** by Robert C. Martin
- **Clean Code** by Robert C. Martin
- **Domain-Driven Design** by Eric Evans
- **NestJS Documentation** (official docs)
- **TypeScript Deep Dive** (online book)

---

**Next:** Review [15-Environment-Variables.md](15-Environment-Variables.md)

