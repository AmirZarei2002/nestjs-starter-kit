# NestJS Clean Architecture Starter Kit

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A production-ready NestJS starter kit following Clean Architecture principles, designed for building scalable and maintainable enterprise applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style: Prettier" />
  <img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest" />
</p>

---

## 🎯 Features

### Architecture & Design
- ✅ **Clean Architecture** - Separation of concerns with clear boundaries
- ✅ **Domain-Driven Design** - Business logic in the domain layer
- ✅ **SOLID Principles** - Maintainable and extensible code
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Use Case Pattern** - Application business rules
- ✅ **Dependency Injection** - Loose coupling via injection tokens

### Technical Stack
- ✅ **NestJS 11** - Progressive Node.js framework
- ✅ **TypeScript 5.7** - Type safety and modern JavaScript
- ✅ **Prisma 6** - Type-safe ORM with migrations
- ✅ **PostgreSQL** - Robust relational database
- ✅ **Redis** - Caching and session management
- ✅ **ESLint** - Code quality and consistency
- ✅ **Prettier** - Code formatting

### Features & Utilities
- ✅ **Pagination** - Built-in pagination utility
- ✅ **Caching** - Redis-based caching with decorators
- ✅ **Logging** - Winston logger with custom service
- ✅ **Validation** - Class-validator for DTO validation
- ✅ **CORS** - Configurable CORS support
- ✅ **Rate Limiting** - Throttler for API protection
- ✅ **Docker Support** - Docker & Docker Compose configuration
- ✅ **Module Generator** - CLI tool for rapid module creation

### Developer Experience
- ✅ **Comprehensive Documentation** - 16+ detailed guides
- ✅ **Testing Setup** - Jest with Faker.js for mock data
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Hot Reload** - Fast development with watch mode
- ✅ **Path Aliases** - Clean imports with @ prefix
- ✅ **Seed Data** - Database seeding scripts

---

## 📁 Project Structure

```
nestjs-starter-kit/
├── docs/                           # Comprehensive documentation
│   ├── 00-README.md               # Documentation index
│   ├── 01-Quick-Start.md          # Getting started guide
│   ├── 02-Project-Structure.md    # Architecture overview
│   ├── 03-Architecture-Overview.md
│   ├── 04-Module-Creation-Guide.md
│   ├── 05-Repository-Pattern.md
│   ├── 06-Use-Cases-Pattern.md
│   ├── 07-DTOs-And-Validation.md
│   ├── 08-Common-Folder-Guide.md
│   ├── 12-Import-Patterns.md
│   ├── 14-Best-Practices.md
│   ├── 15-Environment-Variables.md
│   ├── 16-Module-Communication-Best-Practices.md
│   ├── DOCKER.md                  # Docker deployment guide
│   └── ESLINT_RULES.md           # ESLint configuration
│
├── src/
│   ├── common/                    # Shared utilities and types
│   │   ├── dtos/                 # Common DTOs (pagination, etc.)
│   │   ├── types/                # Common types
│   │   └── utils/                # Utility functions
│   │
│   ├── config/                    # Application configuration
│   │   └── cors.config.ts        # CORS settings
│   │
│   ├── modules/                   # Feature modules
│   │   └── category/             # Example module
│   │       ├── application/      # Application layer
│   │       │   ├── dtos/        # Data Transfer Objects
│   │       │   └── use-cases/   # Business logic
│   │       ├── domain/           # Domain layer
│   │       │   ├── entities/    # Business entities
│   │       │   ├── interfaces/  # Repository contracts
│   │       │   ├── mappers/     # Entity mappers
│   │       │   └── tokens/      # Injection tokens
│   │       ├── infrastructure/   # Infrastructure layer
│   │       │   └── prisma/
│   │       │       ├── persistence/     # Repositories
│   │       │       └── presentation/    # Controllers
│   │       └── category.module.ts
│   │
│   ├── prisma/                    # Prisma service
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── shared/                    # Shared services
│   │   ├── cache/                # Caching module
│   │   ├── interceptors/         # Global interceptors
│   │   └── services/             # Shared services
│   │
│   ├── utils/                     # Global utilities
│   └── main.ts                    # Application entry point
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
│
├── test/                          # Test utilities
│   ├── helpers/                  # Test helpers
│   │   ├── mock-factories.ts    # Faker-based factories
│   │   ├── test-utils.ts        # Testing utilities
│   │   └── mock-prisma.service.ts
│   ├── examples/                 # Test examples
│   ├── FAKER-QUICK-REFERENCE.md
│   └── README.md
│
├── tools/
│   └── generate-module.ts        # Module generator CLI
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── logs/                          # Application logs
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Redis** >= 6.x (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/AmirZarei2002/nestjs-starter-kit.git
cd nestjs-starter-kit

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/nestjs-starter-kit"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run seed
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build the project
npm run start:prod         # Run production build

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report

# Database
npm run seed               # Seed database
npx prisma studio          # Open Prisma Studio GUI
npx prisma migrate dev     # Create new migration
npm run db:reset           # Reset database

# Module Generation
npm run gen:module         # Generate new module (interactive)

# Docker
npm run docker:up          # Start containers
npm run docker:down        # Stop containers
npm run docker:logs        # View logs
npm run docker:reset       # Reset and reseed
```

### Creating a New Module

This starter kit includes a powerful module generator:

```bash
npm run gen:module
```

Follow the interactive prompts to generate a complete module with:
- Domain layer (entities, interfaces, mappers)
- Application layer (DTOs, use cases)
- Infrastructure layer (repositories, controllers)
- Module configuration

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│              (Controllers, DTOs)                     │
├─────────────────────────────────────────────────────┤
│                  Application Layer                   │
│              (Use Cases, Services)                   │
├─────────────────────────────────────────────────────┤
│                    Domain Layer                      │
│          (Entities, Interfaces, Logic)               │
├─────────────────────────────────────────────────────┤
│                 Infrastructure Layer                 │
│         (Database, External Services)                │
└─────────────────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Rule**: Dependencies point inward. Inner layers don't know about outer layers.
2. **Interface Segregation**: Small, focused interfaces for each responsibility.
3. **Dependency Injection**: Use injection tokens for loose coupling between modules.
4. **Repository Pattern**: Abstract data access behind repository interfaces.
5. **Use Case Pattern**: Each use case represents a single business operation.

### Module Communication

Modules communicate through **injection tokens**, not concrete implementations:

```typescript
// ✅ CORRECT: Use injection tokens
import { CATEGORY_REPOSITORY_TOKENS } from '@modules/category';
inject: [CATEGORY_REPOSITORY_TOKENS.FIND_CATEGORY_BY_ID]

// ❌ WRONG: Don't import concrete implementations
import { GetCategoryByIdRepository } from '@modules/category/infrastructure';
```

📖 See [Module Communication Best Practices](docs/16-Module-Communication-Best-Practices.md)

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

| Document | Description |
|----------|-------------|
| [Quick Start](docs/01-Quick-Start.md) | Getting started guide |
| [Project Structure](docs/02-Project-Structure.md) | Folder organization |
| [Architecture Overview](docs/03-Architecture-Overview.md) | Clean Architecture principles |
| [Module Creation](docs/04-Module-Creation-Guide.md) | How to create modules |
| [Repository Pattern](docs/05-Repository-Pattern.md) | Data access pattern |
| [Use Cases](docs/06-Use-Cases-Pattern.md) | Business logic organization |
| [DTOs & Validation](docs/07-DTOs-And-Validation.md) | Input validation |
| [Common Folder](docs/08-Common-Folder-Guide.md) | Shared utilities |
| [Import Patterns](docs/12-Import-Patterns.md) | Path aliases |
| [Best Practices](docs/14-Best-Practices.md) | Coding standards |
| [Environment Variables](docs/15-Environment-Variables.md) | Configuration |
| [Module Communication](docs/16-Module-Communication-Best-Practices.md) | Inter-module dependencies |
| [Docker Guide](docs/DOCKER.md) | Docker deployment |
| [ESLint Rules](docs/ESLINT_RULES.md) | Linting configuration |

---

## 🧪 Testing

### Unit Tests

Tests are co-located with source files using the `.spec.ts` extension:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### Test Utilities

The starter kit includes comprehensive testing utilities:

- **Faker.js Integration**: Generate realistic mock data effortlessly
- **Mock Factories**: Pre-built factories for common entities
- **Test Helpers**: Utilities for common testing patterns

```typescript
import { createMockCategoryEntity } from '@test/helpers/mock-factories';

// Generate realistic mock data
const category = createMockCategoryEntity({
  name: 'Electronics', // Override specific fields
  // Other fields auto-generated with Faker
});
```

📖 See [Test Documentation](test/README.md) and [Faker Quick Reference](test/FAKER-QUICK-REFERENCE.md)

---

## 🐳 Docker Support

### Quick Start with Docker

```bash
# Start all services (app + PostgreSQL + Redis)
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Reset and reseed database
npm run docker:reset
```

### Docker Services

- **App Container**: NestJS application
- **PostgreSQL**: Database service
- **Redis**: Caching service

📖 See [Docker Documentation](docs/DOCKER.md)

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nestjs-starter-kit"

# Server
PORT=3000
NODE_ENV=development

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

📖 See [Environment Variables Guide](docs/15-Environment-Variables.md)

---

## 📦 Technologies

### Core
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Prisma](https://www.prisma.io/) - Next-generation ORM

### Database & Caching
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Redis](https://redis.io/) - In-memory data store

### Validation & Transformation
- [class-validator](https://github.com/typestack/class-validator) - Decorator-based validation
- [class-transformer](https://github.com/typestack/class-transformer) - Object transformation

### Testing
- [Jest](https://jestjs.io/) - Testing framework
- [Faker.js](https://fakerjs.dev/) - Mock data generation
- [@nestjs/testing](https://docs.nestjs.com/fundamentals/testing) - NestJS testing utilities

### Code Quality
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript ESLint](https://typescript-eslint.io/) - TypeScript linting

### Logging & Monitoring
- [Winston](https://github.com/winstonjs/winston) - Logging library
- [nest-winston](https://github.com/gremo/nest-winston) - NestJS Winston integration

---

## 🎨 Code Style

This project follows strict code quality standards:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Clean Architecture** for organization
- **SOLID Principles** for design

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

---

## 🤝 Best Practices

### Module Structure
- Follow Clean Architecture layers strictly
- Use injection tokens for module communication
- Keep business logic in use cases
- Abstract data access with repositories

### Naming Conventions
- **Entities**: `*.entity.ts` (e.g., `category.entity.ts`)
- **DTOs**: `*.dto.ts` (e.g., `create-category.dto.ts`)
- **Use Cases**: `*.usecase.ts` (e.g., `get-categories.usecase.ts`)
- **Repositories**: `*.repository.ts` (e.g., `get-categories.repository.ts`)
- **Controllers**: `*.controller.ts` (e.g., `category.controller.ts`)

### Import Patterns
Use path aliases for clean imports:

```typescript
// ✅ Good
import { CategoryEntity } from '@category/domain';
import { PaginationQueryDto } from '@common/dtos/pagination-query.dto';

// ❌ Avoid
import { CategoryEntity } from '../../../domain/entities/category.entity';
```

📖 See [Best Practices Guide](docs/14-Best-Practices.md)

---

## 🚢 Deployment

### Building for Production

```bash
# Build the application
npm run build

# Run production build
npm run start:prod
```

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run
```

### Environment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set secure `JWT_SECRET` (if using authentication)
- [ ] Configure CORS for production domains
- [ ] Set up proper logging levels
- [ ] Enable Redis for caching
- [ ] Run migrations in production
- [ ] Set up monitoring and error tracking

---

## 📊 API Documentation

Once the application is running, you can access the API:

### Example Endpoints

#### Categories
```bash
# Get all categories (with pagination)
GET http://localhost:3000/categories?page=1&size=10

# Get category by ID
GET http://localhost:3000/categories/:id

# Create category
POST http://localhost:3000/categories
Content-Type: application/json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}

# Update category
PATCH http://localhost:3000/categories/:id
Content-Type: application/json
{
  "name": "Updated Name"
}

# Delete category
DELETE http://localhost:3000/categories/:id
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation update
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

---

## 📝 License

This project is [MIT licensed](LICENSE).

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Amazing framework
- [Prisma](https://www.prisma.io/) - Excellent ORM
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin
- All open-source contributors

---

## 📞 Support

- 📚 [Documentation](docs/00-README.md)
- 💬 [NestJS Discord](https://discord.gg/G7Qnnhy)
- 🐛 [Issue Tracker](https://github.com/AmirZarei2002/nestjs-starter-kit/issues)

---

<p align="center">
  Made with ❤️ using NestJS
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="50" alt="Nest Logo" />
  </a>
</p>
