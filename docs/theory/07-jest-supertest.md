# Theory 07 — Jest & Supertest

**Stage:** 07  
**Packages:** `jest`, `supertest`

---

## 1. Why test APIs?

Manual curl checks don’t scale. Automated tests:

- Catch regressions when you refactor  
- Document expected behavior  
- Run in CI before deploy  

---

## 2. Types of tests (for backends)

| Type | Scope | Speed |
|------|-------|-------|
| Unit | One function (hash, map, pure helper) | Fast |
| Integration | Express routes + DB (or test DB) | Medium |
| E2E | Full system through real network | Slow |

This stage emphasizes **integration tests** with Supertest.

---

## 3. Jest basics

```js
describe('POST /auth/login', () => {
  it('returns 401 for bad password', async () => {
    expect(status).toBe(401);
  });
});
```

| API | Use |
|-----|-----|
| `describe` | Group |
| `it` / `test` | One case |
| `expect` | Assertions |
| `beforeAll` / `afterAll` | Setup / teardown |

---

## 4. Supertest

Supertest sends HTTP requests to your Express `app` **without** listening on a real port:

```js
import request from 'supertest';
import { app } from '../src/app.js'; // export app without listen

await request(app)
  .post('/auth/login')
  .send({ email: 'a@b.com', password: 'x' })
  .expect(401);
```

**Design tip:** split `app.js` (build app) from `server.js` (listen). Tests import `app`.

---

## 5. What to assert

- Status codes (`200`, `201`, `400`, `401`, `404`)  
- Response body shape  
- Side effects (row created — via follow-up GET or DB)  
- Auth: missing token → `401`; valid token → success  

---

## 6. Test data hygiene

- Use a separate test database or transactional rollback  
- Don’t run destructive tests against production  
- Seed minimal fixtures in `beforeAll` / per test  

---

## 7. Arrange / Act / Assert

```js
// Arrange — create user
// Act     — call login
// Assert  — expect token + 200
```

Keep tests readable; one main behavior per `it`.

---

## Self-check

1. Why export `app` separately from `listen`?
2. Unit vs integration — one example of each for an auth API.
3. What should a test for protected `/me` cover?

Next → [08 — Winston & nginx](./08-winston-nginx.md)
