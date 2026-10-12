# Theory 09 — Online Store API design

**Stage:** 09 (capstone)  
**App:** `apps/store-api`  
**Stack:** Express + dotenv + cors + morgan + yup + uuid + bcryptjs + JWT + Drizzle + winston + Jest/Supertest (+ nginx in deploy)

---

## 1. Goal

Backend only for an online store: users can register/login, browse products, manage a cart, and place orders. Admins manage the catalog.

No frontend — test with curl / REST client / automated tests.

---

## 2. Domain model

| Entity | Core fields | Notes |
|--------|-------------|-------|
| User | id, email, passwordHash, role | roles: `user`, `admin` |
| Product | id, name, description, price, stock | admin writes |
| Cart | userId + line items | productId, qty |
| Order | id, userId, status, total, createdAt | snapshot of purchase |
| OrderItem | orderId, productId, qty, priceAtPurchase | freeze price at checkout |

**Price at purchase:** store the price on the order line so later catalog changes don’t rewrite history.

---

## 3. API surface (suggested)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /me` (auth)

### Products
- `GET /products` (public)
- `GET /products/:id` (public)
- `POST /products` (admin)
- `PATCH /products/:id` (admin)
- `DELETE /products/:id` (admin)

### Cart
- `GET /cart` (auth)
- `POST /cart/items` (auth) — add/update qty
- `DELETE /cart/items/:productId` (auth)

### Orders
- `POST /orders/checkout` (auth) — cart → order, decrement stock
- `GET /orders` (auth) — my orders
- `GET /orders/:id` (auth) — mine only (admin may see all)

---

## 4. Authorization rules

| Action | Who |
|--------|-----|
| Read products | Anyone |
| Write products | `admin` |
| Cart / checkout | Authenticated `user` (or admin) |
| See another user’s orders | `admin` only |

Use `requireAuth` + `requireRole('admin')` middleware.

---

## 5. Checkout consistency

Checkout should be transactional:

1. Lock / read cart + product stock  
2. Verify stock  
3. Create order + items  
4. Decrement stock  
5. Clear cart  

If any step fails → roll back (DB transaction).

---

## 6. Validation & errors

- Yup for bodies (register, product, cart qty)  
- `400` validation, `401` auth, `403` role, `404` missing, `409` stock conflict  

---

## 7. Cross-cutting

- morgan + winston  
- Health: `/health` includes DB ping  
- Tests: auth, admin guard, checkout happy path + empty cart + insufficient stock  

---

## Self-check

1. Why store `priceAtPurchase` on order items?
2. What does a checkout transaction protect you from?
3. Which endpoints must be admin-only?

Next → [10 — Encrypted messenger](./10-messenger-encryption.md)
