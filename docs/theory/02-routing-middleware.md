# Theory 02 — Routing & middleware

**Stage:** 02  
**Package:** `express` (deeper)

---

## 1. Why structure matters

A single `server.js` with every route becomes hard to change. Real APIs split by **feature**:

```
app.js / server.js     create app, mount middleware, listen
routes/notes.js        notes endpoints
middleware/logger.js   shared middleware
middleware/error.js    central error handler
```

Express supports this with **`Router`** and the **middleware pipeline**.

---

## 2. The middleware pipeline

Every request flows through a stack:

```
request
  → middleware 1
  → middleware 2
  → route handler
  → (response)
```

```js
app.use(fn);           // runs for (almost) every request
app.use('/api', fn);   // runs when path starts with /api
app.get('/x', fn);     // runs only for GET /x
```

### `next()`

```js
function logger(req, res, next) {
  console.log(req.method, req.url);
  next(); // hand off to the next layer
}
```

| Action | Effect |
|--------|--------|
| `next()` | Continue |
| omit `next` and don’t respond | Request hangs |
| respond (`res.json`) | End cycle (don’t call `next` after) |
| `next(err)` | Skip to error-handling middleware |

---

## 3. Express Router

```js
import { Router } from 'express';

const notesRouter = Router();

notesRouter.get('/', listNotes);
notesRouter.get('/:id', getNote);
notesRouter.post('/', createNote);

export { notesRouter };
```

Mount it:

```js
app.use('/api/notes', notesRouter);
// GET /api/notes     → notesRouter GET /
// GET /api/notes/3   → notesRouter GET /:id
```

Inside the router, paths are **relative** to the mount point.

---

## 4. Middleware on a router

```js
notesRouter.use((req, res, next) => {
  // only for /api/notes/*
  next();
});
```

Or per-route:

```js
notesRouter.delete('/:id', requireAuth, deleteNote);
```

Multiple handlers run in order.

---

## 5. Error-handling middleware

Special signature — **four** arguments:

```js
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

app.use(errorHandler); // after routes
```

Throw or pass errors:

```js
app.get('/boom', (req, res, next) => {
  next(new Error('Something broke'));
});
```

In async handlers (Express 5), rejected promises are forwarded more reliably than in Express 4. Still learn `try/catch` + `next(err)` as a safe habit.

---

## 6. Custom errors (pattern)

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// usage
next(new HttpError(404, 'Note not found'));
```

Central handler reads `err.status`.

---

## 7. 404 vs error handler

| Middleware | When |
|------------|------|
| 404 `app.use((req,res)=>…)` | No route matched |
| Error `app.use((err,req,res,next)=>…)` | Something called `next(err)` or threw |

Order:

1. Parsers / logging middleware  
2. Routes  
3. 404 handler  
4. Error handler (last)

---

## 8. Request-scoped data

You can attach data for later handlers:

```js
req.requestId = crypto.randomUUID();
req.user = { id: 1 }; // later: from JWT
```

Convention: don’t overwrite Express internals; use clear names.

---

## Self-check

1. What does `next()` do? What if you forget it?
2. How does `app.use('/api/notes', router)` change paths inside the router?
3. How can Express tell error middleware from normal middleware?
4. In what order should routes, 404, and error handlers be mounted?

Next → [03 — dotenv, CORS, morgan](./03-dotenv-cors-morgan.md)
