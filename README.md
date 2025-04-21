# Medium App Clone

This is a monorepo containing a Medium-like application with a backend service and a common package for shared types and validations.

## Project Structure

```
├── backend/           # Backend service using Cloudflare Workers and Prisma
├── common/            # Shared types and validation schemas
```

## Packages

### Backend

The backend service is built using:
- Cloudflare Workers for serverless deployment
- Hono.js as the web framework
- Prisma with PostgreSQL for database management
- Prisma Accelerate for enhanced database performance

### Common

A shared package (`@coderinthenorth/medium-app-common`) containing:
- Zod schemas for request validation
- TypeScript types for blog and user operations
- Shared utilities used across the application

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository

2. Install dependencies for both packages:

```bash
# Install backend dependencies
cd backend
npm install

# Install common package dependencies
cd ../common
npm install
```

### Development

#### Backend Service

1. Set up your environment variables in the backend directory
2. Start the development server:

```bash
cd backend
npm run dev
```

#### Database Management

The backend uses Prisma with PostgreSQL. Make sure to:
1. Update your database connection string in the Prisma configuration
2. Run migrations when needed

### Deployment

The backend service can be deployed to Cloudflare Workers:

```bash
cd backend
npm run deploy
```

## Features

- User authentication (signup/signin)
- Blog post creation and management
- Type-safe API endpoints using Zod validation
- Serverless architecture with Cloudflare Workers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License