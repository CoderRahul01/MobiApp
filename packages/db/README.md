# @mobi/db

Database package for MobiApp using Prisma with PostgreSQL.

## Setup

1. Make sure you have PostgreSQL running
2. Copy `.env.example` to `.env` and update the DATABASE_URL
3. Install dependencies:
```bun install```

## Available Commands

- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Prisma Studio

## Usage

Import the Prisma client from this package:

```typescript
import { prisma } from "@mobi/db";