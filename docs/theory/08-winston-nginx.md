# Theory 08 — Winston & nginx

**Stage:** 08  
**Packages:** `winston`  
**Ops:** nginx

---

## 1. Two kinds of logs

| Tool | Role |
|------|------|
| morgan | HTTP access lines (method, url, status, duration) |
| winston | Application events (startup, auth failures, errors, business facts) |

Example winston event:

```json
{ "level": "error", "message": "payment failed", "orderId": "…", "time": "…" }
```

---

## 2. Winston concepts

| Concept | Meaning |
|---------|---------|
| Level | `error`, `warn`, `info`, `http`, `debug` |
| Transport | Where logs go (console, file, remote) |
| Format | Text vs JSON |

```js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

logger.info('server started', { port: 9008 });
logger.error('unhandled', { err: err.message });
```

In production, prefer **structured JSON** so log systems can search fields.

**Sanitize:** never log passwords, tokens, or full card numbers.

---

## 3. Where to log

| Event | Level |
|-------|-------|
| Server listen | `info` |
| Validation failure | `warn` or debug (can be noisy) |
| Auth failure | `warn` |
| Uncaught / 500 | `error` |
| Successful order | `info` |

Wire `errorHandler` to `logger.error`.

---

## 4. nginx as reverse proxy

Browsers / internet talk to **nginx**; nginx forwards to Node:

```
Client → nginx (:80/:443) → Express (:9008)
```

Why:

- TLS termination (HTTPS certificates)  
- Static files (if any)  
- Load balancing / multiple instances  
- Hide Node port from the public  

### Conceptual config

```nginx
server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_pass http://127.0.0.1:9008;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Express can trust proxy headers when behind nginx (`app.set('trust proxy', 1)`) so `req.ip` and secure cookies behave correctly.

---

## 5. TLS overview

- **certbot** / Let’s Encrypt often issues certs for nginx  
- Node can do TLS itself, but production usually terminates TLS at nginx  

---

## Self-check

1. morgan vs winston — one sentence each.
2. Why JSON logs in production?
3. What problem does `proxy_set_header X-Forwarded-For` help with?
4. Why not expose Express port directly on the public internet?

Next → [09 — Store API design](./09-store-api-design.md)
