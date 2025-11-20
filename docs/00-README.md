# Starter-kit - Documentation Index

Welcome to the Starter-kit documentation! This is a production-ready NestJS Starter-kit following Clean Architecture principles, designed to be used as a starting point for scalable backend applications.

## 📚 Documentation Structure

### Getting Started
- **[01-Quick-Start.md](01-Quick-Start.md)** - Get up and running in 5 minutes
- **[02-Project-Structure.md](02-Project-Structure.md)** - Understanding the project layout
- **[03-Architecture-Overview.md](03-Architecture-Overview.md)** - Clean Architecture principles

### Core Concepts
- **[04-Module-Creation-Guide.md](04-Module-Creation-Guide.md)** - Step-by-step module creation
- **[05-Repository-Pattern.md](05-Repository-Pattern.md)** - Data access layer
- **[06-Use-Cases-Pattern.md](06-Use-Cases-Pattern.md)** - Business logic layer
- **[07-DTOs-And-Validation.md](07-DTOs-And-Validation.md)** - Request/response validation

### Shared Resources
- **[08-Common-Folder-Guide.md](08-Common-Folder-Guide.md)** - Reusable utilities
- **[09-Shared-Folder-Guide.md](09-Shared-Folder-Guide.md)** - Application-level features
- **[10-Decorators-Guide.md](10-Decorators-Guide.md)** - Custom decorators
- **[11-Configuration-Guide.md](11-Configuration-Guide.md)** - Environment & config

### Development
- **[12-Import-Patterns.md](12-Import-Patterns.md)** - Path aliases & barrel exports
- **[ESLINT_RULES.md](ESLINT_RULES.md)** - Linting rules & conventions
- **[.eslintrc-quick-reference.md](.eslintrc-quick-reference.md)** - Quick ESLint fixes
- **[13-Testing-Guide.md](13-Testing-Guide.md)** - Unit & integration tests
- **[14-Best-Practices.md](14-Best-Practices.md)** - Coding standards

### Architecture & Patterns
- **[16-Module-Communication-Best-Practices.md](16-Module-Communication-Best-Practices.md)** - Inter-module dependencies

### Deployment
- **[DOCKER.md](DOCKER.md)** - Docker setup & deployment
- **[15-Environment-Variables.md](15-Environment-Variables.md)** - Configuration reference

## 🎯 Quick Navigation

### I want to...

**Create a new module**  
→ Read [04-Module-Creation-Guide.md](04-Module-Creation-Guide.md)

**Understand the architecture**  
→ Read [03-Architecture-Overview.md](03-Architecture-Overview.md)

**Add validation to DTOs**  
→ Read [07-DTOs-And-Validation.md](07-DTOs-And-Validation.md)

**Create a custom decorator**  
→ Read [10-Decorators-Guide.md](10-Decorators-Guide.md)

**Fix import errors**  
→ Read [12-Import-Patterns.md](12-Import-Patterns.md) or [ESLINT_RULES.md](ESLINT_RULES.md)

**Add caching to endpoints**  
→ Read [09-Shared-Folder-Guide.md](09-Shared-Folder-Guide.md#caching)

**Deploy with Docker**  
→ Read [DOCKER.md](DOCKER.md)

**Share code between modules**  
→ Read [16-Module-Communication-Best-Practices.md](16-Module-Communication-Best-Practices.md)

## 🏗️ Starter-kit Features

✅ **Clean Architecture** - Separation of concerns  
✅ **Repository Pattern** - Abstracted data access  
✅ **Use Cases** - Encapsulated business logic  
✅ **Path Aliases** - Clean imports (`@common`, `@shared`, etc.)  
✅ **Barrel Exports** - Simplified module interfaces  
✅ **ESLint Rules** - Enforced code quality  
✅ **TypeScript** - Full type safety  
✅ **Prisma ORM** - Type-safe database access  
✅ **Caching** - Built-in Redis caching  
✅ **Logging** - Winston logger integration  
✅ **Rate Limiting** - Throttler protection  
✅ **CORS** - Configurable CORS  
✅ **Validation** - class-validator integration  
✅ **API Versioning** - URI-based versioning  
✅ **Docker** - Production-ready containers  

## 🚀 Technology Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL (via Prisma)
- **Cache:** Redis
- **Logging:** Winston
- **Validation:** class-validator
- **Testing:** Jest

## 📖 Reading Order

### For New Developers
1. Quick Start
2. Project Structure
3. Architecture Overview
4. Module Creation Guide
5. Import Patterns
6. Best Practices

### For Experienced NestJS Developers
1. Architecture Overview
2. Module Creation Guide
3. Repository Pattern
4. Import Patterns
5. Best Practices

### For Starter-kit Users
1. Quick Start
2. Module Creation Guide
3. Configuration Guide
4. Environment Variables
5. Docker Guide

## 🤝 Contributing

See [14-Best-Practices.md](14-Best-Practices.md) for coding standards and contribution guidelines.

## 📝 Notes

- All examples use the `Category` module as a reference implementation
- Path aliases are configured in `tsconfig.json`
- ESLint enforces import patterns automatically
- This Starter-kit follows NestJS best practices

## 🆘 Support

If you encounter issues or have questions:
1. Check the relevant documentation section
2. Review the `Category` module as a working example
3. Run `npm run lint` to identify code issues
4. Check environment variables in `.env`

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**License:** UNLICENSED (Private Starter-kit)

