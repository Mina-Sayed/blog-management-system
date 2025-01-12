# Blog Management System

A robust RESTful API built with NestJS for managing blog posts with user authentication, role-based authorization, and advanced features.

## Features

### Core Features
- User authentication with JWT
- Role-based access control (Admin, Editor)
- Blog post management with tags
- PostgreSQL database with TypeORM
- Swagger API documentation

### Advanced Features
- Redis caching for improved performance
- Rate limiting for API protection
- Winston logging system
- Health checks
- Docker support
- Database hosted on Neon (Serverless PostgreSQL)
- Redis hosted on Railway

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **Authentication**: JWT, Passport
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Winston Logger** 

## Prerequisites

- Node.js (v18 or later)
- pnpm
- Docker and Docker Compose
- PostgreSQL
- Redis

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-management-system
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following in your `.env`:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=your-neon-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
DB_SSL=true

# Redis
REDIS_URL=your-redis-url
REDIS_HOST=redis.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_USERNAME=default

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h

# Swagger
SWAGGER_TITLE=Blog Management API
SWAGGER_DESCRIPTION=API documentation
SWAGGER_VERSION=1.0
SWAGGER_PATH=api
```

## Running the Application

### Development
```bash
# Start dependencies (PostgreSQL & Redis)
docker-compose up -d postgres redis

# Run in development mode
pnpm run start:dev
```

### Production
```bash
pnpm run build
pnpm run start:prod
```

### Docker
```bash
docker compose up -d
```

## API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

### Main Endpoints

#### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login and get JWT token

#### Blog Posts
- GET `/blogs` - Get all blog posts (with pagination and tag filtering)
- GET `/blogs/:id` - Get specific blog post
- POST `/blogs` - Create blog post (Admin/Editor)
- PUT `/blogs/:id` - Update blog post (Admin/Editor)
- DELETE `/blogs/:id` - Delete blog post (Admin)

## Caching Strategy
- Redis cache implemented for blog posts
- Cache TTL: 5 minutes
- Automatic cache invalidation on blog updates
- Hosted on Railway for production

## Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to authentication endpoints
- Redis-based rate limiting storage

## Database
- Hosted on Neon (Serverless PostgreSQL)
- SSL enabled
- Automatic migrations in production
- TypeORM for database management

## Deployment
Currently deployed on Railway with:
- Automatic deployments from main branch
- PostgreSQL database on Neon
- Redis instance on Railway
- Environment variables managed through Railway dashboard

## Testing
```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```


