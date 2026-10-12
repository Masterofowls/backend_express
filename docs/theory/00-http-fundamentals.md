# Theory 00 — HTTP fundamentals for APIs

You do not need to build a raw Node server, but you **must** understand HTTP. Express only wraps this model.

---

## 1. Client and server

- **Client** — anything that sends a request (browser, mobile app, curl, another API).
- **Server** — process that listens on a port and returns responses.

One request → one response (for normal HTTP). The server does not “call back” later unless you use other tech (WebSockets, SSE — later stages).

---

## 2. Anatomy of a request

| Part | Example | Meaning |
|------|---------|---------|
| Method | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Intent / verb |
| URL / path | `/products/3` | Resource |
| Query string | `?page=2&limit=10` | Optional filters |
| Headers | `Content-Type: application/json` | Metadata |
| Body | `{ "name": "Mouse" }` | Payload (usually not on GET) |

### Methods (REST-ish conventions)

| Method | Typical use | Idempotent? | Has body? |
|--------|-------------|-------------|-----------|
| `GET` | Read | Yes | No |
| `POST` | Create | No | Yes |
| `PUT` | Replace whole resource | Yes | Yes |
| `PATCH` | Partial update | Usually | Yes |
| `DELETE` | Remove | Yes | Rarely |

**Idempotent** = repeating the same request leaves the same server state.

---

## 3. Anatomy of a response

| Part | Example | Meaning |
|------|---------|---------|
| Status code | `200`, `404` | Outcome class |
| Headers | `Content-Type: application/json` | Metadata |
| Body | `{ "id": 1 }` | Payload |

### Status code families

| Range | Class | You will use |
|-------|-------|--------------|
| 2xx | Success | `200` OK, `201` Created, `204` No Content |
| 4xx | Client error | `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found |
| 5xx | Server error | `500` Internal Server Error |

**Remember:** `404` = “I understood the request, but that resource/route isn’t here.”  
`500` = “Something broke on my side.”

---

## 4. JSON APIs

Most modern backends speak JSON:

- Request: `Content-Type: application/json` + JSON body
- Response: same content type + JSON body

Strings in JSON use double quotes. Numbers are not quoted. `null` is valid.

---

## 5. Ports and URLs

```
http://localhost:9001/products/2
│      │         │     │
│      │         │     └─ path
│      │         └─ port (your Express process)
│      └─ host
└─ scheme
```

In this course, practice servers use ports **9000+**.

---

## 6. Testing without a frontend

```bash
curl http://localhost:9001/products
curl -X POST http://localhost:9001/products ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Headset\",\"price\":59}"
```

(PowerShell may prefer `Invoke-RestMethod` or a GUI client like Thunder Client / Insomnia.)

---

## Self-check

1. Name three parts of an HTTP request.
2. When do you use `201` instead of `200`?
3. Is `GET /products/1` expected to have a body?
4. What does `400` mean vs `404`?

When ready → [01 — Express basics](./01-express-basics.md).
