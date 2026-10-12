# Theory 03 — dotenv, CORS, morgan

**Stage:** 03  
**Packages:** `dotenv`, `cors`, `morgan` (+ `express`)

---

## 1. Configuration with dotenv

Hardcoding secrets and ports is unsafe and inflexible.

`.env` (never commit real secrets):

```env
PORT=9003
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

`.env.example` (commit this — placeholders only):

```env
PORT=9003
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Load early (before reading `process.env`):

```js
import 'dotenv/config';
// or
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 9003;
```

### Crash-fast validation

```js
const required = ['PORT'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env: ${key}`);
    process.exit(1);
  }
}
```

| Do | Don’t |
|----|-------|
| Commit `.env.example` | Commit `.env` |
| Use env for secrets | Hardcode JWT secrets |
| Validate required keys | Silently use wrong defaults in prod |

---

## 2. CORS (Cross-Origin Resource Sharing)

Browsers block frontends on `http://localhost:5173` from calling `http://localhost:9003` unless the API allows it via CORS headers.

```js
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN, // or true for open (dev only)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
```

| Setting | Meaning |
|---------|---------|
| `origin: true` | Reflect request origin (loose) |
| `origin: 'https://app.example.com'` | Only that site |
| `origin: false` | Disable CORS |

curl and server-to-server calls are **not** subject to browser CORS. CORS protects browser users, not your API alone — you still need auth (Stage 05).

---

## 3. HTTP logging with morgan

morgan logs each HTTP request (method, url, status, time):

```js
import morgan from 'morgan';

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

| Format | Use |
|--------|-----|
| `dev` | Colored, concise (local) |
| `combined` | Apache-style (prod files / stdout) |
| `tiny` | Minimal |

morgan = **access log** (per request).  
winston (Stage 08) = **application log** (business events, errors, context).

Use both later: morgan for HTTP line noise, winston for structured app events.

---

## 4. Recommended middleware order (Stage 03)

```js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// routes...
// 404...
// errors...
```

---

## Self-check

1. Why commit `.env.example` but not `.env`?
2. Does CORS stop curl from hitting your API?
3. morgan vs winston — what’s the difference in purpose?
4. Why load dotenv before reading `process.env.PORT`?

Next → [04 — Yup & uuid](./04-yup-uuid.md)
