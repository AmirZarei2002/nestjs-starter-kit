# Quick Start Guide

Get your starter-kit up and running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Redis server (for caching)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd starter-kit

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Minimum Required Variables:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/starter-kit-db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

See [15-Environment-Variables.md](15-Environment-Variables.md) for complete reference.

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/api/v1`

## ✅ Verify Installation

Test the API:

```bash
# Get all categories
curl http://localhost:3000/api/v1/categories

# Create a category
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","description":"Test Description"}'
```

## 🐳 Quick Start with Docker

Prefer Docker? Use Docker Compose:

```bash
# Start all services
npm run docker:up

# Check logs
npm run docker:logs

# Stop services
npm run docker:down
```

See [DOCKER.md](DOCKER.md) for detailed Docker setup.

## 📁 Project Structure Overview

```
starter-kit/
├── src/
│   ├── modules/          # Feature modules
│   │   └── category/     # Example module
│   ├── common/           # Shared utilities
│   ├── shared/           # App-level features
│   ├── config/           # Configuration
│   ├── prisma/           # Database client
│   └── main.ts           # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/                 # Documentation
└── docker/               # Docker configs
```

## 🎯 Next Steps

### For Development
1. Read [02-Project-Structure.md](02-Project-Structure.md)
2. Understand [03-Architecture-Overview.md](03-Architecture-Overview.md)
3. Create your first module: [04-Module-Creation-Guide.md](04-Module-Creation-Guide.md)

### For Configuration
1. Configure [11-Configuration-Guide.md](11-Configuration-Guide.md)
2. Set up [15-Environment-Variables.md](15-Environment-Variables.md)
3. Review [DOCKER.md](DOCKER.md) for deployment

### For Code Quality
1. Learn [12-Import-Patterns.md](12-Import-Patterns.md)
2. Review [ESLINT_RULES.md](ESLINT_RULES.md)
3. Follow [14-Best-Practices.md](14-Best-Practices.md)

## 🛠️ Available Commands

### Development
```bash
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debugger
npm run build            # Build for production
npm run start:prod       # Run production build
```

### Database
```bash
npm run seed             # Seed database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration
```

### Quality
```bash
npm run lint             # Check linting
npm run lint -- --fix    # Fix linting issues
npm run format           # Format code
npm test                 # Run tests
```

### Docker
```bash
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
npm run docker:logs      # View logs
npm run docker:shell     # Access container shell
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Ensure database exists
createdb starter-kit-db
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001

# Or kill process using port
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📚 Learning Path

**Day 1: Setup & Understanding**
- Complete this Quick Start
- Read Project Structure
- Explore Architecture Overview

**Day 2: Development Basics**
- Create a simple module
- Understand repositories
- Learn use cases pattern

**Day 3: Advanced Features**
- Add validation
- Implement caching
- Create custom decorators

**Week 2: Production Ready**
- Write tests
- Configure Docker
- Deploy application

## 💡 Tips

- Use the `Category` module as reference
- Run `npm run lint` frequently
- Check documentation when stuck
- Follow the import patterns
- Keep modules independent

## 🎓 Example: Creating Your First Endpoint

```typescript
// 1. Create entity (domain/entities/product.entity.ts)
export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
  ) {}
}

// 2. Create DTO (application/dtos/create-product.dto.ts)
export class CreateProductDto {
  @IsString()
  name: string;
  
  @IsNumber()
  price: number;
}

// 3. Create repository interface (domain/interfaces/...)
export interface ICreateProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
}

// 4. Create use case (application/use-cases/...)
export class CreateProductUseCase {
  execute(data: CreateProductDto): Promise<ProductEntity> {
    return this.repository.create(data);
  }
}

// 5. Create controller (infrastructure/controllers/...)
@Controller('products')
export class ProductController {
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
```

See [04-Module-Creation-Guide.md](04-Module-Creation-Guide.md) for complete details.

---

**Ready to dive deeper?** Continue to [02-Project-Structure.md](02-Project-Structure.md)

