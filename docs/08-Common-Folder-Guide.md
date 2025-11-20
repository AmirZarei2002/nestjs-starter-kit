# Common Folder Guide

Complete guide to the `src/common/` folder - reusable utilities and helpers.

## 🎯 Purpose

The `common/` folder contains framework-agnostic,reusable code that can be used across multiple modules without business logic dependencies.

**Key Principle:** Code in `common/` should NOT depend on specific business modules.

## 📁 Structure

```
src/common/
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
├── types/             # Shared TypeScript types
│   ├── paginated-result.type.ts
│   └── pagination-meta.type.ts
├── utils/             # Helper functions
│   ├── env.util.ts
│   └── paginate.util.ts
├── validators/        # Custom validators
└── index.ts          # Barrel export
```

## 📝 Detailed Breakdown

### 1. `dtos/` - Shared Data Transfer Objects

DTOs used across multiple modules.

**Example: Pagination DTO**

```typescript
// common/dtos/pagination-query.dto.ts
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

  @IsOptional()
  @Type(() => String)
  include?: string[];
}
```

**Usage:**
```typescript
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';

@Get()
findAll(@Query() query: PaginationQueryDto) {
  return this.useCase.execute(query);
}
```

### 2. `types/` - Shared TypeScript Types

Type definitions used across modules.

**Example: Paginated Result Type**

```typescript
// common/types/pagination-meta.type.ts
export type PaginationMeta = {
  total: number;
  page: number;
  size: number;
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
};

// common/types/paginated-result.type.ts
import { PaginationMeta } from './pagination-meta.type';

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
```

**Usage:**
```typescript
import { PaginatedResult } from '@common/types/paginated-result.type';

async findAll(): Promise<PaginatedResult<ProductEntity>> {
  return {
    data: products,
    meta: {
      total: 100,
      page: 1,
      size: 10,
      lastPage: 10,
      prevPage: null,
      nextPage: 2,
    },
  };
}
```

### 3. `utils/` - Helper Functions

Pure utility functions.

**Example: Environment Utility**

```typescript
// common/utils/env.util.ts
export function getEnvArray(
  key: string,
  defaultValue: string[] = [],
): string[] {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }

  return value.split(',').map((item) => item.trim());
}

export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}
```

**Example: Pagination Utility**

```typescript
// common/utils/paginate.util.ts
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { PaginatedResult } from '../types/paginated-result.type';

type PrismaDelegate<T, FindManyArgs, CountArgs> = {
  findMany: (args: FindManyArgs) => Promise<T[]>;
  count: (args?: CountArgs) => Promise<number>;
};

export async function paginate<T, Entity, FindManyArgs, CountArgs>(
  model: PrismaDelegate<T, FindManyArgs, CountArgs>,
  query: PaginationQueryDto,
  mapFn: (item: T) => Entity,
  options: Omit<FindManyArgs, 'skip' | 'take' | 'orderBy'>,
  orderBy?: FindManyArgs extends { orderBy: infer O } ? O : unknown,
  where?: CountArgs extends { where: infer W } ? W : unknown,
): Promise<PaginatedResult<Entity>> {
  const { page = 1, size = 10 } = query;
  const skip = (page - 1) * size;
  const take = size;

  const [total, items] = await Promise.all([
    model.count({ where } as CountArgs),
    model.findMany({ ...options, skip, take, orderBy } as FindManyArgs),
  ]);

  const data = items.map(mapFn);
  const lastPage = Math.ceil(total / size);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  return {
    data,
    meta: {
      total,
      page,
      size,
      lastPage,
      prevPage,
      nextPage,
    },
  };
}
```

**Usage:**
```typescript
import { paginate } from '@common/utils/paginate.util';

async findAll(query: PaginationQueryDto) {
  return paginate(
    this.prisma.product,
    query,
    ProductMapper.toEntity,
    { orderBy: { createdAt: 'desc' } },
  );
}
```

### 4. `decorators/` - Custom Decorators

Reusable decorators.

**Example: Current User Decorator**

```typescript
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Usage:**
```typescript
@Get('profile')
getProfile(@CurrentUser() user: UserEntity) {
  return user;
}
```

**Example: Public Route Decorator**

```typescript
// common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Usage:**
```typescript
@Public()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

### 5. `guards/` - Route Guards

Authentication and authorization guards.

**Example: JWT Auth Guard**

```typescript
// common/guards/jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
```

### 6. `exceptions/` - Custom Exceptions

Application-specific exceptions.

**Example: Entity Not Found Exception**

```typescript
// common/exceptions/entity-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID ${id} not found`);
  }
}
```

**Usage:**
```typescript
const product = await this.repository.findOne(id);

if (!product) {
  throw new EntityNotFoundException('Product', id);
}
```

### 7. `filters/` - Exception Filters

Global error handling.

**Example: HTTP Exception Filter**

```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: exceptionResponse,
    });
  }
}
```

### 8. `interceptors/` - Request/Response Interceptors

Transform requests/responses.

**Example: Transform Interceptor**

```typescript
// common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  success: boolean;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        success: true,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

### 9. `constants/` - Application Constants

**Example: Constants File**

```typescript
// common/constants/app.constants.ts
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 60, // seconds
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

export const HTTP_STATUS_MESSAGES = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};
```

### 10. `validators/` - Custom Validators

**Example: Custom Validator**

```typescript
// common/validators/is-before-date.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBeforeDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            value instanceof Date &&
            relatedValue instanceof Date &&
            value < relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be before ${relatedPropertyName}`;
        },
      },
    });
  };
}
```

## 📋 Barrel Export

`common/index.ts`:

```typescript
// DTOs
export * from './dtos/pagination-query.dto';

// Types
export * from './types/paginated-result.type';
export * from './types/pagination-meta.type';

// Utils
export * from './utils/env.util';
export * from './utils/paginate.util';

// Decorators
export * from './decorators/current-user.decorator';
export * from './decorators/public.decorator';

// Guards
export * from './guards/jwt-auth.guard';

// Exceptions
export * from './exceptions/entity-not-found.exception';

// Constants
export * from './constants/app.constants';
```

## ✅ When to Add to Common

### DO Add:
- ✅ Generic utilities used in multiple modules
- ✅ Framework-agnostic helpers
- ✅ Shared DTOs (pagination, filtering)
- ✅ Common types
- ✅ Reusable decorators
- ✅ Auth guards
- ✅ Exception filters

### DON'T Add:
- ❌ Business logic
- ❌ Module-specific code
- ❌ Database queries
- ❌ Feature-specific DTOs

## 🎯 Best Practices

1. **Keep It Pure**: No business logic
2. **Make It Reusable**: Should work in any module
3. **Document Well**: Add JSDoc comments
4. **Test Thoroughly**: Unit test utilities
5. **Export from Barrel**: Use `index.ts`

---

**Next:** Learn about [09-Shared-Folder-Guide.md](09-Shared-Folder-Guide.md)

