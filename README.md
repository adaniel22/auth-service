# auth-service

Authentication and user management service for the microservices webshop. It is one component of the stack orchestrated by [shop-infra](https://github.com/adaniel22/shop-infra).

## Overview

The service owns the user accounts and issues the tokens the other services rely on:

- **Access token** — JWT signed with `JWT_SECRET`, valid for 1 hour.
- **Refresh token** — JWT signed with `JWT_REFRESH_SECRET`, lifetime from `JWT_REFRESH_EXPIRES`. Only a bcrypt hash of it is stored in the database, and it is rotated on every use: a successful refresh issues a new token pair and replaces the stored hash.
- **Passwords** — hashed with bcrypt (cost factor 12) and never returned in API responses.

Both tokens are sent as `Authorization: Bearer <token>`. Protected routes expect the access token; `POST /auth/refresh` expects the refresh token.

## Endpoints

### Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | — | Verifies email + password, returns `{ accessToken, refreshToken }` (200). |
| `GET` | `/auth/profile` | Access token | Returns the authenticated user's `{ userId, email }`. |
| `POST` | `/auth/refresh` | Refresh token | Validates the refresh token against the stored hash and returns a new token pair (200). |

### Users

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/users` | — | Registers a user (`email`, `password` min. 8 chars). |
| `GET` | `/users` | Access token | Lists all users. |
| `GET` | `/users/:id` | Access token | Returns a single user. |
| `PATCH` | `/users/:id` | Access token | Updates the user's `email`. |
| `PATCH` | `/users/:id/password` | Access token | Changes the password (`oldPassword`, `newPassword`); the old password must match. |
| `DELETE` | `/users/:id` | Access token | Deletes the user (204). |

`GET /` returns a plain health/greeting string.

> Note: every user route except registration requires a valid access token. Authentication is enforced, but per-user authorization is not — any authenticated user can currently read, modify or delete any account. Ownership checks ("you can only modify your own account") are a planned next step.

Request bodies are validated globally with `class-validator` (`whitelist` + `forbidNonWhitelisted`), so unknown properties are rejected.

## Tech stack

- NestJS 11 (TypeScript)
- MikroORM 6 + PostgreSQL 16
- Passport / `@nestjs/jwt` for JWT access and refresh strategies
- bcrypt for password and refresh token hashing
- Docker (Node 24 Alpine)

## Running this service

Normally you do not start this service on its own — it runs as part of the Docker Compose stack in [shop-infra](https://github.com/adaniel22/shop-infra), which also provides the `auth-db` PostgreSQL instance and injects the environment variables. See that repo for the full setup.

Configuration is read from environment variables; `.env.example` lists all of them (database connection, `PORT`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES`). Copy it to `.env` and fill in your own values — never commit real secrets.

Database migrations are applied with:

```bash
npm run mikro-orm -- migration:up
```

For local development against a reachable database:

```bash
npm install
npm run start:dev     # http://localhost:3000
```

Tests:

```bash
npm test
```
