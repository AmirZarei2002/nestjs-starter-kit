# DTOs and Validation Guide

Complete guide to Data Transfer Objects (DTOs) and validation in starter-kit.

## 🎯 What are DTOs?

**DTOs (Data Transfer Objects)** are objects that carry data between processes. In our application, they define and validate the shape of data coming into our API.

### Key Benefits:
- ✅ **Type Safety**: TypeScript type checking
- ✅ **Validation**: Automatic input validation
- ✅ **Documentation**: Self-documenting API contracts
- ✅ **Transformation**: Auto-convert types
- ✅ **Security**: Whitelist allowed fields

## 📁 Location

```
src/modules/{module}/application/dtos/
├── create-{entity}.dto.ts
├── update-{entity}.dto.ts
└── {custom}-{entity}.dto.ts
```

## 📝 Basic Structure

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @IsOptional()
  @IsString()
  optionalProperty?: string;
}
```

## 🔄 Complete Examples

### Create DTO

```typescript
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

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

### Update DTO

```typescript
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

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

## 🎨 Validation Decorators

### String Validators

```typescript
import { 
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsUrl,
} from 'class-validator';

export class StringExamplesDto {
  // Basic string
  @IsString()
  name: string;

  // Not empty
  @IsString()
  @IsNotEmpty()
  required: string;

  // Length constraints
  @Length(3, 50)
  username: string;

  @MinLength(8)
  password: string;

  @MaxLength(255)
  description: string;

  // Email
  @IsEmail()
  email: string;

  // URL
  @IsUrl()
  website: string;

  // Regex pattern
  @Matches(/^[a-zA-Z0-9]+$/)
  alphanumeric: string;
}
```

### Number Validators

```typescript
import {
  IsNumber,
  IsInt,
  Min,
  Max,
  IsPositive,
  IsNegative,
  IsDivisibleBy,
} from 'class-validator';

export class NumberExamplesDto {
  // Basic number
  @IsNumber()
  amount: number;

  // Integer only
  @IsInt()
  quantity: number;

  // Range
  @Min(0)
  @Max(100)
  percentage: number;

  // Positive
  @IsPositive()
  price: number;

  // Minimum
  @Min(0)
  stock: number;
}
```

### Boolean Validators

```typescript
import { IsBoolean } from 'class-validator';

export class BooleanExamplesDto {
  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
```

### Date Validators

```typescript
import { IsDate, IsDateString, MinDate, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DateExamplesDto {
  // Date object
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  // ISO string
  @IsDateString()
  createdAt: string;

  // Minimum date
  @IsDate()
  @MinDate(new Date('2020-01-01'))
  @Type(() => Date)
  startDate: Date;
}
```

### Array Validators

```typescript
import {
  IsArray,
  IsString,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ArrayExamplesDto {
  // String array
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  // With size constraints
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  categories: string[];

  // Nested objects
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
```

### Nested Object Validators

```typescript
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Nested object
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

### Enum Validators

```typescript
import { IsEnum } from 'class-validator';

enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
```

### UUID Validators

```typescript
import { IsUUID } from 'class-validator';

export class GetProductDto {
  @IsUUID()
  id: string;

  @IsUUID('4') // UUID v4 specifically
  userId: string;
}
```

## 🔧 Custom Validators

### Creating Custom Validator

```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Custom decorator
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
          const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
          return strongRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters with uppercase, lowercase, and number';
        },
      },
    });
  };
}

// Usage
export class CreateUserDto {
  @IsStrongPassword()
  password: string;
}
```

### Class Validator with Async

```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !user; // Return false if user exists
  }

  defaultMessage() {
    return 'Email already exists';
  }
}

// Decorator
export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}

// Usage
export class CreateUserDto {
  @IsEmail()
  @IsEmailUnique()
  email: string;
}
```

## 🔄 Transformation

### Type Conversion

```typescript
import { Type } from 'class-transformer';
import { IsInt, IsDate, IsBoolean } from 'class-validator';

export class QueryDto {
  // Convert string to number
  @Type(() => Number)
  @IsInt()
  page: number;

  // Convert string to boolean
  @Type(() => Boolean)
  @IsBoolean()
  isActive: boolean;

  // Convert string to Date
  @Type(() => Date)
  @IsDate()
  startDate: Date;
}
```

### Array Transformation

```typescript
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class SearchDto {
  // Convert comma-separated string to array
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  // Transform to lowercase
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  search: string;
}
```

## 🎯 Common Patterns

### Pagination DTO

```typescript
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  @Type(() => String)
  sort?: 'createdAt' | 'updatedAt';

  @IsOptional()
  @Type(() => String)
  order?: 'asc' | 'desc';
}
```

### Filter DTO

```typescript
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(100000)
  maxPrice?: number;
}
```

### Partial Update DTO

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// All fields become optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

## 🚫 Common Mistakes

### ❌ DON'T: Forget Transformation

```typescript
// ❌ BAD - No type transformation
export class QueryDto {
  @IsInt()
  page: number; // Will fail validation (comes as string from query)
}

// ✅ GOOD - With transformation
export class QueryDto {
  @Type(() => Number) // Transform string to number
  @IsInt()
  page: number;
}
```

### ❌ DON'T: Mix Entities and DTOs

```typescript
// ❌ BAD
async create(@Body() data: CategoryEntity) {} // Using entity as DTO

// ✅ GOOD
async create(@Body() data: CreateCategoryDto) {} // Using DTO
```

### ❌ DON'T: Skip Validation

```typescript
// ❌ BAD - No validation
export class CreateProductDto {
  name: string; // No decorators
  price: number; // No decorators
}

// ✅ GOOD - With validation
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

## 📋 DTO Checklist

When creating a DTO:

- [ ] All fields have validation decorators
- [ ] Use `@IsOptional()` for optional fields
- [ ] Add `@Type()` for query parameters
- [ ] Use appropriate validators
- [ ] Consider min/max constraints
- [ ] Add custom validation if needed
- [ ] Export from barrel file
- [ ] Use in controller methods

## 💡 Best Practices

### 1. Always Validate

```typescript
// Every field should have validators
@IsString()
@IsNotEmpty()
name: string;
```

### 2. Use Type Transformation for Query Params

```typescript
@Type(() => Number)
@IsInt()
page: number;
```

### 3. Separate Create and Update DTOs

```typescript
CreateProductDto  // All required fields
UpdateProductDto  // All optional fields
```

### 4. Use Enums for Fixed Values

```typescript
enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@IsEnum(ProductStatus)
status: ProductStatus;
```

### 5. Validate Nested Objects

```typescript
@ValidateNested()
@Type(() => AddressDto)
address: AddressDto;
```

## 🎯 Validation Configuration

Global validation is configured in `src/main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,        // Auto-transform types
    whitelist: true,       // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
  }),
);
```

Custom configuration in `src/utils/validation-options.ts`:

```typescript
export const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    // Custom error formatting
    const errors = getPrettyClassValidatorErrors(validationErrors);
    return new BadRequestException({
      message: 'validation error',
      errors: errors,
    });
  },
};
```

---

**Next:** Learn about [08-Common-Folder-Guide.md](08-Common-Folder-Guide.md)

