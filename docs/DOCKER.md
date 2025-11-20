# Docker Setup for starter-kit

This document provides instructions for running the starter-kit application using Docker.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose
- Git

## Quick Start

1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone <repository-url>
   cd starter-kit
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file with your configuration:**
   - Set your database credentials
   - Configure ZarinPal payment settings
   - Set JWT secret for production
   - Configure CORS origins

4. **Start the application:**
   ```bash
   npm run docker:up
   ```

The application will be available at `http://localhost:3000`

## Available Commands

### Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the Docker image |
| `npm run docker:run` | Run the container with .env file |
| `npm run docker:up` | Start all services with docker-compose |
| `npm run docker:down` | Stop all services |
| `npm run docker:logs` | View logs from all services |
| `npm run docker:restart` | Restart all services |
| `npm run docker:clean` | Clean up containers, volumes, and images |

## Services

The Docker setup includes the following services:

### 1. Application (starter-kit-app)
- **Port:** 3000
- **Image:** Built from Dockerfile
- **Health Check:** Database connectivity check
- **Dependencies:** PostgreSQL, Redis

### 2. PostgreSQL Database (starter-kit-postgres)
- **Port:** 5432
- **Image:** postgres:15-alpine
- **Health Check:** pg_isready
- **Volume:** postgres_data

### 3. Redis Cache (starter-kit-redis)
- **Port:** 6379
- **Image:** redis:7-alpine
- **Health Check:** redis-cli ping
- **Volume:** redis_data

### 4. Database Migration (starter-kit-migrate)
- **Runs once:** After PostgreSQL is healthy
- **Command:** `npx prisma migrate deploy`

### 5. Database Seeding (starter-kit-seed)
- **Runs once:** After migration completes
- **Command:** `npm run seed`

## Environment Variables

### Required Variables
```env
# Database
POSTGRES_DB=starter-kit
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/starter-kit?schema=public

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Payment Gateway (Example)
PAYMENT_API_KEY=your-merchant-id
PAYMENT_API_SECRET=your-payment-secret

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
CORS_HEADERS=Content-Type,Authorization
```

### Optional Variables
```env
# Application
NODE_ENV=production
PORT=3000

# File Upload
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=5242880

# Logging
LOG_LEVEL=info
LOG_FILE=logs/combined.log
ERROR_LOG_FILE=logs/error.log
```

## Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence
- `./uploads:/app/uploads`: File uploads (mounted from host)

## Networks

All services run on the `starter-kit-network` bridge network for internal communication.

## Health Checks

- **Application:** Checks database connectivity every 30s
- **PostgreSQL:** Checks if database is ready every 10s
- **Redis:** Pings Redis every 10s

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Database connection failed:**
   ```bash
   # Check if PostgreSQL is running
   docker-compose logs postgres
   
   # Check database health
   npm run db:health
   ```

3. **Permission issues with uploads:**
   ```bash
   # Fix uploads directory permissions
   sudo chown -R $USER:$USER uploads/
   chmod -R 755 uploads/
   ```

4. **Out of disk space:**
   ```bash
   # Clean up Docker resources
   npm run docker:clean
   
   # Remove unused images
   docker image prune -a
   ```

### Logs

View logs for specific services:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d starter-kit

# Reset database
npm run db:reset

# Run migrations manually
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npm run seed
```

## Production Deployment

For production deployment:

1. **Set strong passwords and secrets in `.env`**
2. **Use production Docker Compose:**
   ```bash
   npm run docker:prod
   ```
3. **Configure reverse proxy (nginx) for SSL termination**
4. **Set up monitoring and logging**
5. **Regular backups of PostgreSQL data**

## Security Considerations

- Change default passwords
- Use strong JWT secrets
- Configure proper CORS origins
- Enable SSL/TLS in production
- Regular security updates
- Monitor container logs
- Use Docker secrets for sensitive data

## Performance Optimization

- Adjust memory limits in `docker-compose.prod.yml`
- Use Docker volumes for better I/O performance
- Configure Redis memory limits
- Monitor resource usage
- Use multi-stage builds (already implemented)

## Backup and Restore

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres starter-kit > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres starter-kit < backup.sql
```

### Backup Uploads
```bash
tar -czf uploads-backup.tar.gz uploads/
```

## Monitoring

Monitor your containers:
```bash
# Container stats
docker stats

# Service status
docker-compose ps

# Resource usage
docker system df
```
