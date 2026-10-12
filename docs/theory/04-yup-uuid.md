# Theory 04 — Yup validation & uuid

**Stage:** 04  
**Packages:** `yup`, `uuid`

---

## 1. Never trust the client

Anything in `req.body`, `req.query`, or `req.params` can be missing, wrong type, or malicious.

Manual checks scale poorly:

```js
if (!name || typeof name !== 'string' || name.length < 2) { ... }
```

**Yup** lets you declare a schema and validate once.

---

## 2. Yup schemas

```js
import * as yup from 'yup';

const createProductSchema = yup.object({
  name: yup.string().trim().min(2).max(100).required(),
  price: yup.number().positive().required(),
});
```

Validate:

```js
const data = await createProductSchema.validate(req.body, {
  abortEarly: false, // collect all errors
  stripUnknown: true, // remove extra fields
});
```

On failure, Yup throws a `ValidationError` with `err.errors` (messages).

---

## 3. Validation middleware pattern

```js
function validateBody(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
  };
}

router.post('/products', validateBody(createProductSchema), createProduct);
```

Handler then assumes `req.body` is clean.

You can build the same for `req.query` / `req.params`.

---

## 4. Useful Yup rules (cheat sheet)

| Rule | Example |
|------|---------|
| Required string | `yup.string().required()` |
| Email | `yup.string().email()` |
| Number min/max | `yup.number().min(0).max(9999)` |
| Enum | `yup.mixed().oneOf(['user', 'admin'])` |
| Nested object | `yup.object({ address: yup.object({...}) })` |
| Array | `yup.array().of(yup.string()).min(1)` |

---

## 5. uuid — unique ids

Auto-increment ids (`1, 2, 3`) are fine for demos. In distributed systems and public APIs, **UUIDs** are common:

```js
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4(); // "3b12f1df-..."
```

| Approach | Pros | Cons |
|----------|------|------|
| Integer serial | Short, simple | Predictable; hard across DBs |
| UUID v4 | Unique without central counter | Longer strings |

Stage 04 practice uses uuid for resource ids. Databases may still use serial/uuid columns (Stage 06).

---

## 6. Where validation sits

```
cors → morgan → json parser → validate → auth → handler → error handler
```

Validate **before** business logic and usually **before** heavy DB work.

---

## Self-check

1. Why `abortEarly: false`?
2. Why `stripUnknown: true`?
3. Why return `400` (not `500`) on validation failure?
4. Name one reason to prefer uuid over `nextId++`.

Next → [05 — Auth](./05-auth-jwt-bcrypt.md)
