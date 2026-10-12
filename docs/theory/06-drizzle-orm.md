# Theory 06 — Drizzle ORM

**Stage:** 06  
**Packages:** `drizzle-orm`, `drizzle-kit`, Postgres driver (`postgres` or `pg`)

---

## 1. Why a database?

In-memory arrays die when the process restarts and don’t scale across servers. Production APIs need durable storage.

**ORM / query builder** = typed way to talk to SQL without string-concatenating queries by hand.

---

## 2. Why Drizzle?

Drizzle is SQL-close and TypeScript-friendly:

- You define **schema in code**
- You generate / run **migrations**
- Queries look like SQL, with types

Compared to heavy ORMs, Drizzle stays thin — good for learning real SQL concepts.

---

## 3. Core pieces

| Piece | Role |
|-------|------|
| Schema file | Tables, columns, relations |
| drizzle-kit | Generate / apply migrations |
| db client | Runtime connection + query API |
| Migrations | Versioned SQL changes |

Typical layout:

```
src/db/schema.ts
src/db/index.ts
drizzle/          -- generated SQL migrations
drizzle.config.ts
```

---

## 4. Schema mental model

```ts
// conceptual example
users: id, email, passwordHash, createdAt
notes: id, userId, title, body, createdAt
```

Relations: one user → many notes (`userId` foreign key).

---

## 5. Query patterns you will learn

- `insert` user on register  
- `select` user by email on login  
- `select` / `insert` / `update` / `delete` notes scoped by `userId`  
- Transactions for multi-step writes (later / store checkout)

Always scope user data by authenticated `userId` — never trust a client-sent user id alone.

---

## 6. Migrations

Changing schema in production without migrations breaks data.

Flow:

1. Edit schema  
2. Generate migration  
3. Apply migration  
4. Deploy app code  

Never invent columns only in app code without migrating the DB.

---

## 7. Connection & env

```env
DATABASE_URL=postgres://user:pass@localhost:5432/learn_express
```

Validate `DATABASE_URL` at startup. Health check can `SELECT 1`.

---

## 8. Security notes

- Parameterized queries (Drizzle does this) — avoid SQL injection  
- Don’t store plain passwords (Stage 05)  
- Least-privilege DB users in production  

---

## Self-check

1. What problem do migrations solve?
2. Why filter notes by `userId` from the JWT, not from the body alone?
3. What belongs in `DATABASE_URL` vs code?

Next → [07 — Jest & Supertest](./07-jest-supertest.md)
