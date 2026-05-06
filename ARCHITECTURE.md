# Architecture Decision Record
**AI Spend Auditor — Credex**
_Last updated: May 2026_

---

## 1. Frontend: Next.js 15 (App Router) + TypeScript

**Chosen:** Next.js 15 with App Router  
**Alternatives considered:** Vite + React SPA, Remix, SvelteKit

### Justification

| Requirement | Why Next.js wins |
|---|---|
| Server-side rendering for reports | App Router Server Components fetch report data before HTML arrives — enables real SEO and fast first paint |
| Dynamic OG images per report | `next/og` edge runtime makes per-shareId Open Graph images trivial |
| Lighthouse Performance ≥ 85 | Streaming, React Server Components, and automatic code splitting |
| TypeScript | First-class support, no extra config |
| Vercel deployment | Zero-config, edge network, automatic HTTPS |

The landing page is a **zero-JS Server Component** — no hydration cost, ideal for SEO and performance.  
The report page uses **mixed rendering**: server fetch + client interactivity (copy link, email capture).  
The audit form is **client-only** — form state lives in localStorage, no server round-trip until submit.

---

## 2. Backend: Express.js + TypeScript on Render

**Chosen:** Express.js  
**Alternatives considered:** Next.js API routes

### Justification

| Factor | Decision |
|---|---|
| Separation of concerns | Audit engine + DB logic is isolated. Can be versioned and tested independently |
| Prisma v7 + driver adapter | Requires Node.js runtime, not Edge. Express on Render is the clean fit |
| Rate limiting | `express-rate-limit` gives per-IP control without Vercel middleware complexity |
| Testing | Vitest runs pure Node — no Next.js bundler needed to test the audit engine |

> **Note:** "DO NOT overengineer" — the Express server is ~6 files, not a microservice mesh. It is the simplest solution that correctly separates DB/AI logic from the UI layer.

---

## 3. Database: Neon PostgreSQL via Prisma v7

**Chosen:** Neon (serverless Postgres) + Prisma v7  
**Alternatives considered:** PlanetScale, Supabase, SQLite

Neon provides:
- Serverless connection pooling (critical for Render's free tier cold starts)
- Standard PostgreSQL — no vendor lock-in
- Free tier covers MVP usage volume

Prisma v7 with `PrismaPg` adapter provides type-safe queries with the new Rust-free client.

---

## 4. TypeScript

Used throughout — both client and server. No plain JavaScript files in `/src`.

Strict mode enabled. `zod` validates all API boundaries.

---

## 5. Styling: Tailwind CSS (v4)

No UI templates, no component libraries beyond primitives. Every layout is hand-written.  
shadcn/ui is initialized but used only for its CSS variable scaffolding — not for pre-built page layouts.

---

## 6. AI: Google Gemini 1.5 Flash

Used **only** for the 80-100 word executive summary.  
**Not used** for audit calculations — all financial logic is deterministic.  
Failures are caught and replaced with a deterministic fallback summary.

---

## 7. Email: Resend

Transactional email after lead capture. Non-blocking — lead saves to DB even if email fails.

---

## Deployment Architecture

```
User Browser
    │
    ├── Vercel (Next.js)                    ← Static assets, SSR, OG images
    │       │
    │       └── fetch() calls ──────────→  Render (Express API, port 3001)
    │                                              │
    │                                    Neon PostgreSQL (AP-Southeast-1)
    │                                    Google Gemini API
    │                                    Resend
    │
    └── localhost:3000 (dev)
            └── → localhost:3001 (dev API)
```

## Security

- All secrets in environment variables — never committed
- `.env` and `.env.local` in `.gitignore`
- Rate limiting: 10 audit requests/minute per IP
- Honeypot field on both audit form and email capture (bot detection)
- Prisma parameterized queries (no raw SQL injection surface)
- Helmet.js HTTP security headers
- CORS restricted to known frontend origins
