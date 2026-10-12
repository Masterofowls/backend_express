# Learn Express.js — Backend Path

Interactive, stage-based course: Express from scratch to production backends.

**Focus:** API / backend only (no frontend).

## Stack you will master

| Tool | Role |
|------|------|
| Express | HTTP framework |
| dotenv | Environment config |
| bcryptjs | Password hashing |
| cors | Cross-origin access |
| jsonwebtoken (JWT) | Auth tokens |
| uuid | Unique IDs |
| yup | Request validation |
| Drizzle ORM | Typed SQL access |
| morgan | HTTP request logging |
| winston | App / error logging |
| Jest + Supertest | API tests |
| nginx | Reverse proxy / TLS |

## How to learn

1. Open `docs/CURRICULUM.md` — full roadmap.
2. Read theory first → `docs/theory/README.md` (start with 00 + 01).
3. Open the stage `LESSON.md` for checkpoints.
4. Code in `practice/` yourself — tutor teaches, does not solve.
5. Run `checks/`, mark `docs/PROGRESS.md`.
6. In chat: **"done stage N"**, **"quiz me"**, or ask questions.

Each stage has:

- `LESSON.md` — concepts + interactive checkpoints
- `practice/` — your workspace (edit here)
- `solution/` — reference after you try
- `checks/` — scripts or tests to verify

## Capstone projects

| Project | Stage | What you build |
|---------|-------|----------------|
| Mini API | 01–04 | Notes / todos CRUD |
| Online Store API | 09 | Auth, products, cart, orders |
| Encrypted Messenger | 10 | JWT + WebSocket + message encryption |

## Quick start (Stage 01)

```bash
cd stages/01-express-basics/practice
npm install
npm start
```

## Repo layout

```
docs/          curriculum, architecture, progress, activity log
stages/        lessons 01 → 10
apps/          final projects (store, messenger)
packages/      shared utilities later
```

## Prerequisites

- Node.js 20+ (`node -v`)
- npm 10+
- A REST client: curl, Thunder Client, or Insomnia
- Basic JavaScript (async/await, modules)
