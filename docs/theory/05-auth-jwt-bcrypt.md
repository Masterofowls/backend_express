# Theory 05 — Authentication (bcryptjs + JWT)

**Stage:** 05  
**Packages:** `bcryptjs`, `jsonwebtoken`

---

## 1. Auth vs authorization

| Term | Meaning |
|------|---------|
| Authentication | Who are you? (login) |
| Authorization | What may you do? (roles/permissions) |

This stage focuses on authentication + protecting routes. Roles grow in Stage 09 (store admin).

---

## 2. Passwords and bcryptjs

**Never store plain passwords.**

Flow:

1. Register → hash password → store hash only  
2. Login → compare plain password to hash  
3. If match → issue token

```js
import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
const ok = await bcrypt.compare(password, hash); // true/false
```

| Concept | Meaning |
|---------|---------|
| Hash | One-way transform |
| Salt | Random data mixed in (bcrypt does this) |
| Rounds | Cost factor (higher = slower = harder to brute-force) |

We use **bcryptjs** (pure JS) for fewer native build issues on Windows.

---

## 3. JWT (JSON Web Token)

After login, the server issues a signed token. The client sends it on later requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### What’s inside (payload)

```js
{ sub: userId, email: 'a@b.com', iat: ..., exp: ... }
```

Do **not** put secrets or passwords in the payload — it is readable (Base64), only integrity is protected by the signature.

```js
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { sub: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' },
);

const payload = jwt.verify(token, process.env.JWT_SECRET);
```

| Call | Use |
|------|-----|
| `sign` | Create token at login |
| `verify` | Validate on protected routes (throws if bad/expired) |

`JWT_SECRET` must be long, random, and only in env vars.

---

## 4. Auth middleware

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
```

| Code | When |
|------|------|
| `401` | Not authenticated (no/bad token) |
| `403` | Authenticated but not allowed |

---

## 5. Typical endpoints

| Method | Path | Auth? | Purpose |
|--------|------|-------|---------|
| `POST` | `/auth/register` | No | Create user + hash password |
| `POST` | `/auth/login` | No | Check password → JWT |
| `GET` | `/me` | Yes | Current user profile |

---

## 6. Security basics

- HTTPS in production (TLS often terminates at nginx — Stage 08)
- Short-lived access tokens; refresh tokens are an advanced topic
- Constant-time compare is handled by `bcrypt.compare`
- Never log passwords or tokens
- Same error message for “user not found” and “bad password” on login (avoid user enumeration) when possible

---

## Self-check

1. Why store a hash instead of a password?
2. Is JWT payload encrypted by default?
3. Difference between `401` and `403`?
4. Where should `JWT_SECRET` live?

Next → [06 — Drizzle ORM](./06-drizzle-orm.md)
