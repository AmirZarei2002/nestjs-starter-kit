# Environment Variables Reference

Complete guide to environment variables and configuration in starter-kit.

## 📋 Environment Files

### `.env` - Local Development
Main environment file for local development. **Never commit this file.**

### `.env.example` - Starter-kit
Starter-kit file showing all required variables. **Commit this file.**

```bash
# Copy starter-kit to create your .env
cp .env.example .env
```

## 🔧 Required Variables

### Database Configuration

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Example
DATABASE_URL="postgresql://admin:secret123@localhost:5432/starter-kit-db"
```

**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

### Redis Configuration

```env
# Redis Server
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional

# Redis Database Number (0-15)
REDIS_DB=0
```

### Application Configuration

```env
# Server Port
PORT=3000

# Node Environment
NODE_ENV=development  # development | production | test

# API Version
API_VERSION=v1
```

### CORS Configuration

```env
# Allowed Origins (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# CORS Credentials
CORS_CREDENTIALS=true

# Allowed Headers (comma-separated)
CORS_HEADERS=Content-Type,Authorization
```

## 🔐 Optional Variables

### JWT Authentication

```env
# JWT Secret (use strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-here

# JWT Expiration
JWT_EXPIRES_IN=7d  # 7 days

# Refresh Token Expiration
JWT_REFRESH_EXPIRES_IN=30d  # 30 days
```

### Logging Configuration

```env
# Log Level
LOG_LEVEL=debug  # error | warn | info | debug | verbose

# Log Files
LOG_DIR=./logs
```

### Rate Limiting

```env
# Throttle Settings
THROTTLE_TTL=60000  # Time window in milliseconds
THROTTLE_LIMIT=10   # Max requests per TTL
```

### File Upload

```env
# Upload Directory
UPLOAD_DIR=./uploads

# Max File Size (in bytes)
MAX_FILE_SIZE=5242880  # 5MB
```

### Email Configuration (Optional)

```env
# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourapp.com
```

### External Services

```env
# Payment Gateway
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_API_SECRET=your_payment_secret

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## 📝 Complete .env.example

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL="postgresql://admin:password@localhost:5432/starter-kit-db"

# ============================================
# REDIS CONFIGURATION
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ============================================
# APPLICATION CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development
API_VERSION=v1

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
CORS_HEADERS=Content-Type,Authorization

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug
LOG_DIR=./logs

# ============================================
# RATE LIMITING
# ============================================
THROTTLE_TTL=60000
THROTTLE_LIMIT=10

# ============================================
# FILE UPLOAD
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# ============================================
# EMAIL (OPTIONAL)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourapp.com

# ============================================
# EXTERNAL SERVICES (OPTIONAL)
# ============================================
PAYMENT_API_KEY=
PAYMENT_API_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

## 🔧 Accessing Environment Variables

### Using ConfigService (Recommended)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  getSomeValue() {
    // Get with default value
    const port = this.configService.get<number>('PORT', 3000);
    
    // Get required value (throws if not found)
    const dbUrl = this.configService.getOrThrow<string>('DATABASE_URL');
    
    // Get nested config
    const jwtSecret = this.configService.get<string>('jwt.secret');
  }
}
```

### Using Environment Utilities

```typescript
import { getEnvArray, getEnvNumber, getEnvBoolean } from '@common/utils/env.util';

// Get array from comma-separated string
const allowedOrigins = getEnvArray('CORS_ORIGIN', ['http://localhost:3000']);

// Get number
const port = getEnvNumber('PORT', 3000);

// Get boolean
const isProduction = getEnvBoolean('IS_PRODUCTION', false);
```

### Direct Access (Not Recommended)

```typescript
// ❌ Not recommended - no type safety or defaults
const port = process.env.PORT;

// ✅ Better - use ConfigService
const port = this.configService.get<number>('PORT', 3000);
```

## 🏗️ Configuration Files

### Creating Config Files

```typescript
// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  type: 'postgresql',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
```

### Loading Config Files

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
  ],
})
export class AppModule {}
```

### Using Config Files

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

getDbConfig() {
  const dbUrl = this.configService.get<string>('database.url');
  const dbType = this.configService.get<string>('database.type');
}
```

## 🔐 Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore (already configured)
.env
.env.example
```

### 2. Use Strong Secrets in Production

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use in .env
JWT_SECRET=generated_strong_secret_here
```

### 3. Validate Environment Variables

```typescript
// src/config/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsString, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
```

Use validation:
```typescript
ConfigModule.forRoot({
  validate,
}),
```

## 🌍 Environment-Specific Configuration

### Development (.env.development)

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL="postgresql://dev:dev@localhost:5432/starter-kit-dev"
```

### Production (.env.production)

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
DATABASE_URL="postgresql://user:pass@prod-db:5432/starter-kit-prod"
JWT_SECRET=super_strong_production_secret_here
```

### Testing (.env.test)

```env
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
DATABASE_URL="postgresql://test:test@localhost:5432/starter-kit-test"
```

## 🐳 Docker Environment Variables

### docker-compose.yml

```yaml
services:
  app:
    environment:
      - DATABASE_URL=postgresql://admin:password@postgres:5432/starter-kit-db
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - NODE_ENV=production
    env_file:
      - .env
```

## ✅ Environment Checklist

Before deploying:

- [ ] All required variables set
- [ ] Strong JWT secret (64+ characters)
- [ ] Database credentials secure
- [ ] CORS origins correct
- [ ] Log level appropriate
- [ ] File upload limits set
- [ ] Rate limiting configured
- [ ] No secrets in code/git
- [ ] `.env.example` up to date
- [ ] Environment validation added

## 🐛 Troubleshooting

### Variables Not Loading

```bash
# Check if .env exists
ls -la .env

# Verify NODE_ENV
echo $NODE_ENV

# Restart application
npm run start:dev
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql $DATABASE_URL

# Check if database exists
psql -U username -l
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -h localhost -p 6379 ping
# Should return: PONG
```
**Next:** Review [16-Module-Communication-Best-Practices.md](16-Module-Communication-Best-Practices.md)
