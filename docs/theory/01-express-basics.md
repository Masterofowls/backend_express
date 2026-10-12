# Theory 01 — Express basics

**Stage:** 01  
**Package:** `express`  
**Practice port:** `9001`

Read [HTTP fundamentals](./00-http-fundamentals.md) first if any HTTP term is unclear.

---

## 1. What Express is

Express is a minimal Node.js framework for building HTTP servers and APIs.

It sits on top of Node’s built-in `http` module and gives you:

- Declarative **routing** (`app.get`, `app.post`, …)
- A standard **request** (`req`) and **response** (`res`) API
- **Middleware** — functions that run in a pipeline before/around handlers
- Helpers like `res.json()`, `req.params`, `req.query`, `req.body`

Express does **not** include a database, auth, or validation. Those are separate libraries (later stages).

---

## 2. Project setup (ESM)

This course uses ES modules:

```json
{
  "type": "module",
  "dependencies": {
    "express": "^5.x"
  }
}
```

```js
import express from 'express';
```

Use `import`/`export`, not `require`, unless a lesson says otherwise.

---

## 3. Creating an app

```js
import express from 'express';

const app = express();
const PORT = 9001;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
```

| Piece | Role |
|-------|------|
| `express()` | Creates the application object |
| `app` | Where you register middleware and routes |
| `app.listen(port)` | Binds a TCP port and starts accepting HTTP |

`listen` returns a Node HTTP server. The callback runs when the port is ready.

---

## 4. The request / response cycle

```
Client  →  HTTP request  →  Express matches a route  →  your handler runs
Client  ←  HTTP response ←  res.json / res.send / …
```

Handler signature:

```js
(req, res) => { /* ... */ }
```

| Object | Holds |
|--------|--------|
| `req` | Incoming data: method, path, headers, params, query, body |
| `res` | Outgoing tools: status, headers, body |

**Critical rule:** for a normal request, send **exactly one** response. After `res.json(...)` / `res.send(...)` / `res.end(...)`, do not send again. Use `return` after early error responses.

---

## 5. Routing

### Method helpers

```js
app.get('/path', handler);
app.post('/path', handler);
app.put('/path', handler);
app.patch('/path', handler);
app.delete('/path', handler);
```

Express matches **method + path**.  
`GET /products` and `POST /products` are different routes.

### Route order matters

Express checks routes **top to bottom**. The first match wins.

```js
app.get('/products/new', ...);   // must be before /products/:id if "new" is literal
app.get('/products/:id', ...);
```

If `/:id` comes first, a request to `/products/new` may treat `"new"` as an id.

### 404 fallback

If no route matches, register a final middleware:

```js
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
```

Place this **after** all real routes.

---

## 6. Sending responses

### JSON (APIs)

```js
res.json({ ok: true });
// sets Content-Type: application/json and stringifies
```

### Status + JSON

```js
res.status(201).json(product);
res.status(404).json({ error: 'Product not found' });
```

Default status for `res.json` is `200` if you do not set one.

### Other helpers (know they exist)

| Method | Use |
|--------|-----|
| `res.send(data)` | String, Buffer, or object |
| `res.sendStatus(204)` | Status only |
| `res.redirect(url)` | Redirect (rare in pure APIs) |

Prefer `res.json` for JSON APIs.

---

## 7. Reading input

### Path params — `req.params`

```js
app.get('/products/:id', (req, res) => {
  // GET /products/42  →  req.params.id === "42"  (string!)
});
```

Always remember: params are **strings**. Convert before comparing to numbers:

```js
const id = Number(req.params.id);
```

### Query string — `req.query`

```js
// GET /search?q=mouse&limit=10
app.get('/search', (req, res) => {
  const q = req.query.q;       // "mouse"
  const limit = req.query.limit; // "10" (string)
});
```

### Body — `req.body`

Bodies are **not** parsed automatically.

```js
app.use(express.json()); // middleware: parse JSON bodies into req.body

app.post('/products', (req, res) => {
  const { name, price } = req.body ?? {};
});
```

Without `express.json()`:

- `req.body` is usually `undefined`
- Your handler never sees the JSON fields

`express.json()` only affects requests with JSON content types. It must be registered **before** routes that need `req.body`.

---

## 8. Middleware (first look)

Middleware = a function with access to `req`, `res`, and `next`:

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next(); // pass control to the next middleware/route
});
```

| Call | Meaning |
|------|---------|
| `next()` | Continue the chain |
| `next(err)` | Jump to error handler (Stage 02) |
| send response | End the chain (do not call `next` after) |

`express.json()` is built-in middleware. Stage 02 goes deep on custom middleware and routers.

---

## 9. In-memory data (Stage 01 style)

For learning routes, store data in a JS array:

```js
let nextId = 4;
const products = [
  { id: 1, name: 'Keyboard', price: 79 },
];
```

| Pros | Cons |
|------|------|
| Fast to learn | Lost on restart |
| No DB setup | Not multi-process safe |
| Easy to debug | Not for production |

Later: Drizzle + Postgres (Stage 06).

---

## 10. Designing a small products API

| Method | Path | Success | Failure |
|--------|------|---------|---------|
| `GET` | `/` | `200` welcome message | — |
| `GET` | `/health` | `200 { ok: true }` | — |
| `GET` | `/products` | `200` array | — |
| `GET` | `/products/:id` | `200` object | `404` if missing |
| `POST` | `/products` | `201` created object | `400` if invalid body |
| any | unknown | — | `404` |

### POST create flow (mental model)

1. Read `req.body`
2. Validate required fields
3. If invalid → `400` + `return`
4. Build new resource with new id
5. Save (push to array)
6. Respond `201` + created resource

### Truthiness trap

```js
if (!price) { /* bad if price can be 0 */ }
if (price === undefined) { /* safer for optional 0 */ }
```

---

## 11. Common mistakes

| Mistake | What happens | Fix |
|---------|--------------|-----|
| `a \|\| b` with two `res.json` calls | First always runs; second never | Use `if / else` + `return` |
| Forget `express.json()` | `req.body` empty | Add middleware before routes |
| Compare `params.id` to number without `Number()` | `find` always fails | Convert types |
| 404 handler before routes | All routes become 404 | Put fallback last |
| `201` on GET | Wrong semantics | GET success → `200` |
| Two responses | `Cannot set headers after they are sent` | One response + `return` |

---

## 12. How Express relates to later stages

```
Stage 01  express routes + json
Stage 02  routers, middleware chain, errors
Stage 03  dotenv, cors, morgan
Stage 04  yup validation
Stage 05  bcryptjs + jwt auth
Stage 06  drizzle persistence
Stage 07  jest + supertest
Stage 08  winston + nginx
```

Everything later plugs into the same `app` / `req` / `res` / middleware model.

---

## Self-check

1. What does `app.use(express.json())` do, and where must it be placed?
2. Why is `req.params.id` a string?
3. When do you use `201` vs `200` vs `400` vs `404`?
4. Why does `res.json(x) || res.status(404).json(...)` not work?
5. Why must a catch-all 404 be registered after other routes?

---

## Next

1. Skim `stages/01-express-basics/LESSON.md`
2. Finish practice TODOs yourself (tutor reviews only)
3. Run `stages/01-express-basics/checks/verify.mjs` with the server up
4. Then read [02 — Routing & middleware](./02-routing-middleware.md)
