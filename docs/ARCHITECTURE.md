# Architecture — Learning Repo

This repo is a **course monorepo**, not a single deployable app.

## Layout

```
apps/                 Capstone apps (stages 09–10)
  store-api/          Online store backend
  messenger-api/      Realtime encrypted messenger
packages/             Shared code (later stages)
  shared/             Types, schemas, helpers
stages/               Lesson workspaces 01–10
  NN-name/
    LESSON.md         Interactive lesson
    practice/         Student workspace
    solution/         Reference implementation
    checks/           Verification scripts/tests
docs/                 Curriculum & logs
```

## Stage progression (dependency)

```
01 Express
 └─ 02 Routers / middleware
     └─ 03 dotenv + cors + morgan
         └─ 04 yup + uuid
             └─ 05 bcrypt + jwt
                 └─ 06 drizzle
                     └─ 07 jest + supertest
                         └─ 08 winston + nginx
                             ├─ 09 store-api
                             └─ 10 messenger-api
```

## Runtime defaults

- Dev ports: **9000+** (auto-increment if busy)
- Module system: **ESM** (`"type": "module"`)

## Capstone sketch (Stage 09)

```
Client (any) → nginx → Express API → Drizzle → Postgres
                      ├─ JWT auth
                      ├─ Yup validation
                      └─ Winston / Morgan logs
```

## Capstone sketch (Stage 10)

```
Client ↔ WebSocket (JWT) ↔ Express + ws
                         └─ ciphertext messages in DB
```

Encryption goal: demonstrate **at-rest / in-transit awareness** — store encrypted message bodies; keys managed carefully (lesson covers tradeoffs).
