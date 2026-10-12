# Stage 01 — Express basics

**Goal:** Build your first Express API.  
**Time:** ~45–60 min  
**Port:** `9001`  
**Start here** — no prior stages required.

**Theory first (required):**

1. [HTTP fundamentals](../../docs/theory/00-http-fundamentals.md)
2. [Express basics](../../docs/theory/01-express-basics.md)

Do not start practice until you have read both and can answer the Self-check questions.

---

## Concept 1 — What Express is

Express is a Node.js framework for HTTP APIs. You define routes; it handles the request/response plumbing.

| Without Express | With Express |
|-----------------|--------------|
| Manual `if` on method + url | `app.get('/path', handler)` |
| `res.end(JSON.stringify(...))` | `res.json(...)` |
| Manual body parsing | `express.json()` middleware |
| Manual params | `req.params.id` |

Common status codes you’ll use: `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Server Error.

### Checkpoint A

**Why is `res.json(data)` nicer than manually stringifying JSON?**

---

## Concept 2 — Minimal app

```js
import express from 'express';

const app = express();
const PORT = 9001;

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
```

### Checkpoint B

**What does `app.listen` do under the hood?** (one sentence)

---

## Concept 3 — Params, query, body

```js
app.use(express.json()); // parse JSON bodies

app.get('/products/:id', (req, res) => {
  // /products/5  →  req.params.id === "5"
});

app.get('/search', (req, res) => {
  // /search?q=mouse  →  req.query.q === "mouse"
});

app.post('/products', (req, res) => {
  // body: { "name": "Keyboard", "price": 79 }  →  req.body
  res.status(201).json(req.body);
});
```

### Checkpoint C

**Without `express.json()`, what is `req.body` on a JSON POST?**

---

## Practice

Work in `practice/`.

```bash
cd stages/01-express-basics/practice
npm install
npm start
```

### Requirements

1. `GET /` → `{ "message": "Welcome to Stage 01" }`
2. `GET /health` → `{ "ok": true }`
3. `GET /products` → array of products
4. `GET /products/:id` → one product or `404`
5. `POST /products` → create product (`name`, `price`), return `201` with new `id`
6. Unknown routes → `404` `{ "error": "Not found" }`

### Verify

```bash
# server running on 9001
node ../checks/verify.mjs
```

---

## Reflect

Reply in chat with:

1. Checkpoint answers A–C  
2. Your practice code (or ask for review)  
3. **“stage 01 done”** to unlock Stage 02
