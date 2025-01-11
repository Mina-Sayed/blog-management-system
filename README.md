# Blog Management System

A robust RESTful API built with NestJS for managing blog posts with user authentication, role-based authorization, and advanced features.

## Features

### Core Functionality
- User authentication with JWT
- Role-based access control (Admin/Editor)
- Blog post CRUD operations
- Pagination and tag-based filtering
- Swagger API documentation

### Advanced Features
- Redis caching for improved performance
- Rate limiting protection
- Winston logging system
- Health checks monitoring
- Docker containerization

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **Authentication**: JWT, Passport
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

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
# Edit .env with your configuration
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
# Build and start all services
docker-compose up -d
```

## API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

### Available Endpoints

#### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login

#### Blog Posts
- GET /blogs - List all blogs (with pagination & filtering)
- GET /blogs/:id - Get single blog
- POST /blogs - Create new blog (Auth required)
- PUT /blogs/:id - Update blog (Auth required)
- DELETE /blogs/:id - Delete blog (Auth required)

#### Users
- GET /users/:id - Get user details (Admin only)

## Rate Limiting

- 100 requests per 15 minutes window
- Per IP and endpoint tracking
- Applied to authentication endpoints

## Caching Strategy

- Blog posts cached for 5 minutes
- Automatic cache invalidation on updates
- Redis used as caching store

## Testing

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Health Checks

Monitor application health at:
```
http://localhost:3000/health
```

## Docker Support

Build and run with Docker:
```bash
# Build image
docker build -t blog-management-system .

# Run container
docker run -p 3000:3000 blog-management-system
```

Or using Docker Compose:
```bash
docker-compose up -d
```

## Environment Variables

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=blog_management

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=1h

# Swagger
SWAGGER_TITLE=Blog Management API
SWAGGER_DESCRIPTION=API documentation for Blog Management System
SWAGGER_VERSION=1.0
SWAGGER_PATH=api
```

## License

This project is MIT licensed.
