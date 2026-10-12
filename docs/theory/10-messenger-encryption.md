# Theory 10 — Encrypted realtime messenger

**Stage:** 10 (capstone)  
**App:** `apps/messenger-api`  
**Extras:** WebSockets (or Socket.IO), encryption at rest for message bodies

---

## 1. Goal

Backend for a messenger:

- JWT authentication  
- Realtime delivery (WebSocket)  
- Direct messages and/or rooms  
- Message bodies stored as **ciphertext** (encryption demonstrated properly, with clear threat-model limits)

---

## 2. HTTP vs WebSocket

| Channel | Use |
|---------|-----|
| HTTP | Register, login, fetch history, user search |
| WebSocket | Live send/receive, typing (optional), presence (optional) |

Handshake pattern:

1. Client obtainsJWT via HTTP login  
2. Client opens WebSocket with token (query or first message)  
3. Server verifies JWT before joining rooms  

Never trust a socket that skipped auth.

---

## 3. Domain model (suggested)

| Entity | Fields |
|--------|--------|
| User | id, email, passwordHash |
| Conversation | id, type (`dm` \| `room`), title? |
| Membership | conversationId, userId |
| Message | id, conversationId, senderId, ciphertext, iv, createdAt |

Store **ciphertext + IV** (and algorithm metadata), not plaintext.

---

## 4. Encryption — think clearly

### What we teach

- Difference between **in transit** (TLS) and **at rest** (encrypted DB fields)  
- Symmetric encryption of message bodies with a server-side key **or** a documented demo of envelope encryption  
- Never log plaintext messages  

### Threat model honesty

| Protects against | Does not protect against |
|------------------|--------------------------|
| DB dump of plaintext messages (if encrypted at rest) | Compromised server that holds the key |
| Casual operator peeking at DB | Full E2E where server never sees plaintext |

**True end-to-end encryption (E2E)** means the server cannot decrypt — keys live on clients. That is a larger protocol (Signal-style). This course may implement **server-side encryption at rest** first, then discuss E2E as the advanced upgrade.

You will learn:

- Use a vetted library / Node `crypto`  
- Random IV per message  
- Key from env (`MESSAGE_KEY`), never committed  
- Rotate keys as a future topic  

---

## 5. Realtime flow

```
Client A  —WS→  server verifies JWT
Client A  —WS→  send { conversationId, ciphertext, iv }
server         save message row
server    —WS→  members of conversation (except maybe sender)
```

HTTP `GET /conversations/:id/messages` returns history (still ciphertext to clients that can decrypt, or decrypted only if using server-side model carefully documented).

---

## 6. Safety extras

- Rate limit message sends  
- Authorize membership before join/send  
- winston for connection errors (no message content)  
- Jest/Supertest for HTTP auth + history routes  
- Manual or lightweight test for WS auth rejection  

---

## 7. How this closes the course

You combine everything:

Express + env + cors + validation + auth + DB + tests + logs + proxy knowledge + realtime + crypto awareness.

---

## Self-check

1. Why verify JWT on the WebSocket connection?
2. TLS vs encryption-at-rest — difference?
3. Why is “server holds the key” not full E2E?
4. What must never appear in logs?

---

## After Stage 10

You can design and build advanced Express backends. Next learning outside this repo: Redis sessions/pubsub, queues, OpenAPI, rate-limit libraries, OAuth, and real E2E messaging protocols.
