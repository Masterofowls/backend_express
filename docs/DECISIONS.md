# Architecture Decision Records

## ADR-001 — Fresh curriculum repo
**Date:** 2026-10-13  
**Decision:** Build learning materials from scratch; do not reuse prior ad-hoc server files.  
**Why:** Clean staged path with consistent lessons, practice, and solutions.

## ADR-001b — Skip raw Node HTTP stage
**Date:** 2026-10-13  
**Decision:** Start at Express (Stage 01); no separate node-http stage.  
**Why:** Learner preference — go straight to the framework.

## ADR-002 — ESM by default
**Date:** 2026-10-13  
**Decision:** Use `"type": "module"` and `import`/`export` from Stage 01.  
**Why:** Aligns with modern Node and Express docs.

## ADR-003 — bcryptjs (not native bcrypt)
**Date:** 2026-10-13  
**Decision:** Teach `bcryptjs` for password hashing.  
**Why:** Pure JS, fewer native build issues on Windows for learners.

## ADR-004 — Yup for validation
**Date:** 2026-10-13  
**Decision:** Use Yup schemas in middleware before business logic.  
**Why:** Readable schemas; good stepping stone to Zod later if desired.

## ADR-005 — Drizzle over heavy ORMs
**Date:** 2026-10-13  
**Decision:** Persist with Drizzle ORM + SQL migrations.  
**Why:** SQL-close, typed, lightweight for API backends.

## ADR-006 — Ports 9000+
**Date:** 2026-10-13  
**Decision:** Bind practice servers on 9000+.  
**Why:** Avoid conflicts with common 3000/5173 apps.
