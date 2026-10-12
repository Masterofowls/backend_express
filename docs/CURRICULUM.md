# Curriculum — Express Backend Mastery

Estimated pace: **1 stage ≈ 1–3 practice sessions**. Skip ahead only if you can finish that stage’s checks.

---

## Phase A — Foundations

### Stage 01 — Express basics
**Goal:** First Express app.  
**Skills:** `express()`, routes, `res.json`, params, query, body (json), status codes.  
**Practice:** Hello API + products list + POST.  
**Packages:** `express`  
**Unlocks:** Stage 02

### Stage 02 — Routing & middleware
**Goal:** Structure like a real API.  
**Skills:** Routers, middleware chain, errors, 404 handler.  
**Practice:** Modular notes API.  
**Unlocks:** Stage 03

### Stage 03 — Config, CORS, HTTP logging
**Goal:** Env-driven, browser-safe, observable server.  
**Skills:** dotenv, cors, morgan, ports 9000+.  
**Practice:** Configurable public API.  
**Packages:** `dotenv`, `cors`, `morgan`  
**Unlocks:** Stage 04

### Stage 04 — Validation with Yup
**Goal:** Never trust client input.  
**Skills:** Yup schemas, validate middleware, clear 400 errors.  
**Practice:** Validated CRUD for notes.  
**Packages:** `yup`, `uuid`  
**Unlocks:** Stage 05

---

## Phase B — Auth & data

### Stage 05 — Auth (bcrypt + JWT)
**Goal:** Register / login / protected routes.  
**Skills:** bcryptjs hash/compare, JWT sign/verify, auth middleware.  
**Practice:** Users + protected profile.  
**Packages:** `bcryptjs`, `jsonwebtoken`  
**Unlocks:** Stage 06

### Stage 06 — Drizzle ORM + Postgres
**Goal:** Persist data properly.  
**Skills:** schema, migrations, queries, relations.  
**Practice:** Users + notes in DB.  
**Packages:** `drizzle-orm`, `drizzle-kit`, `postgres` (or `pg`)  
**Unlocks:** Stage 07

### Stage 07 — Testing (Jest + Supertest)
**Goal:** Prove the API works.  
**Skills:** unit vs integration, Supertest, auth test helpers.  
**Practice:** Test suite for auth + CRUD.  
**Packages:** `jest`, `supertest`  
**Unlocks:** Stage 08

---

## Phase C — Production

### Stage 08 — Winston + nginx
**Goal:** Logs and reverse proxy like production.  
**Skills:** winston levels/transports, nginx proxy, headers, TLS overview.  
**Practice:** Log pipeline + sample nginx.conf.  
**Packages:** `winston`  
**Ops:** nginx  
**Unlocks:** Stage 09

---

## Phase D — Capstones

### Stage 09 — Online Store API
**Goal:** Full backend for a shop.  
**Features:** register/login, products, cart, checkout, orders, roles (user/admin).  
**Stack:** full combo so far.  
**Unlocks:** Stage 10

### Stage 10 — Realtime Encrypted Messenger
**Goal:** Auth + WebSockets + encrypted payloads.  
**Features:** rooms/DMs, JWT handshake, encrypt/decrypt message bodies (server stores ciphertext).  
**Extras:** rate limits, winston, tests.  
**Done:** You can build advanced Express backends.

---

## Learning rules

1. **Theory first** — read `docs/theory/` for the stage before coding.
2. **Backend only** — clients = curl / REST tools.
3. **You write the code** — tutor reviews and hints; does not solve practice.
4. **Try before `solution/`** — open solutions only if stuck >15 minutes.
5. **One stage at a time** — finish checks before advancing.
6. **Ask in chat** — “explain X”, “review my practice”, “quiz me”.
7. **Ports 9000+** — avoid clashes with other apps.

## Interactive lesson format

1. **Theory** — `docs/theory/NN-*.md`
2. **Lesson** — short checkpoints in `stages/NN-*/LESSON.md`
3. **Practice** — you implement in `practice/`
4. **Verify** — run `checks/`
5. **Reflect** — what you’d change in production
