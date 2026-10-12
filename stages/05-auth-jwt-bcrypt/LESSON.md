# Stage 05 — Auth (bcryptjs + JWT)

**Status:** Outline — unlocked after Stage 04  
**Port:** `9005`  
**Packages:** `bcryptjs`, `jsonwebtoken`

## Goals

- Register / login with hashed passwords
- Issue JWT access tokens
- `requireAuth` middleware for protected routes
- Never log or return password hashes

## Practice preview

`POST /auth/register`, `POST /auth/login`, `GET /me` (protected).

## Unlock when

Stage 04 complete.
