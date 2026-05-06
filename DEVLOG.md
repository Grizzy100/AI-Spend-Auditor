# DEVLOG.md
**AI Spend Auditor — Development Log**
_One entry per day · Real work only_

---

## Day 1 — May 6, 2026 · Project Setup & Architecture

**Work done:**
- Defined product brief: lead-gen SaaS for AI spend auditing
- Decided on architecture: Next.js 15 (App Router) + Express.js backend + Neon PostgreSQL
- Chose Prisma v7 (new ESM client, driver adapter pattern)
- Scaffolded monorepo structure: `/server` + `/client`
- Created server `package.json` with all dependencies (Prisma v7, Gemini, Resend, Zod, Helmet)
- Wrote Prisma schema: `AuditReport` and `Lead` models
- Set up Neon database and pushed schema (`prisma db push` — confirmed connected)
- Created `.env` with real Neon connection string, Gemini API key
- Configured `prisma.config.ts` per v7 requirements (url moved out of schema file)
- Generated Prisma client to `src/generated/prisma`

**Decisions made:**
- Use Express over Next.js API routes — cleaner separation for audit engine testing with Vitest
- Prisma v7 over v5/v6 — future-proofing, forced to use ESM and driver adapters correctly
- `tsx` instead of `ts-node-dev` — better ESM support

**Blockers encountered:**
- Prisma v7 breaking change: `url` must NOT be in `datasource db {}` block. Removed it, moved entirely to `prisma.config.ts`. Resolved.

---

## Day 2 — May 7, 2026 · Audit Engine + Tests

**Work done:**
- Built `server/src/data/pricing.data.ts` — verified pricing for 8 AI tools from official pages
- Built `server/src/services/audit.service.ts` — full deterministic audit engine with:
  - Rule: Team plan for small seat count (ChatGPT, Claude, Windsurf)
  - Rule: Pro+ vs Pro seat sizing (Cursor, Copilot)
  - Rule: Cursor + Copilot overlap
  - Rule: Cursor + Windsurf overlap
  - Rule: Claude Team + ChatGPT Team overlap
  - Rule: Windsurf + Copilot overlap
  - Rule: Overpay detection (>15% above market rate)
  - Benchmark comparison (industry avg by team size + use case)
  - Optimization score (0-100)
- Wrote 9 Vitest tests in `server/src/tests/audit.test.ts`
- All 9 tests passing (`npm test` — confirmed)
- Built Gemini service with deterministic fallback
- Built Resend email service (HTML dark-mode email template)
- Wired up controllers and routes
- Set up Express app with Helmet, CORS, rate limiting

**Decisions made:**
- Savings < $100/month → return "optimized" status (displayed as "You're spending well.")
- Savings > $500/year → show Credex consultation CTA
- All overlap rules are conservative — only flag when both tools serve the same primary function
- Overpay threshold: 15% above official rate (accounts for billing rounding)

---

## Day 3 — May 8, 2026 · Next.js Client Foundation

**Work done:**
- Bootstrapped Next.js 15 App Router client: `create-next-app@latest`
- Installed framer-motion, lucide-react
- Initialized shadcn/ui v4 (CSS scaffolding only)
- Built `app/globals.css` — full dark-mode design system (CSS custom properties)
- Built `app/layout.tsx` — Root layout with full SEO metadata, OG tags, Twitter cards, viewport
- Built `lib/pricing.ts` — client-side pricing catalogue (stays in sync with server)
- Built `lib/api.ts` — typed API client wrapping all 3 backend endpoints
- Built `types/index.ts` — shared TypeScript types

**Decisions made:**
- Landing page = Server Component (zero JS shipped, best Lighthouse score)
- Report page = hybrid: server fetch + client interactivity
- Audit form = pure client (localStorage persistence required)
- No framer-motion on landing (reduces JS bundle, improves mobile performance)

---

## Day 4 — May 9, 2026 · Core Pages

**Work done:**
- Built `app/page.tsx` — Landing page (Server Component, zero client JS)
- Built `app/audit/page.tsx` — Audit form with:
  - localStorage persistence across reloads
  - Live overpay warnings (when spend > official rate by 15%)
  - Honeypot anti-bot field
  - Accessible form labels and ARIA attributes
- Built `app/report/[shareId]/page.tsx` — Server Component (fetches data, generates metadata)
- Built `app/report/[shareId]/ReportClient.tsx` — Client component with:
  - SVG score gauge (animated)
  - Recommendation cards sorted by savings
  - Benchmark bar chart
  - Email capture AFTER results (spec requirement)
  - Consultation upsell for >$500/year savings
  - Copy-to-clipboard share URL
- Built `app/not-found.tsx` — 404 page
- Built `app/api/og/route.ts` — Dynamic OG image via `next/og` edge runtime

---

## Day 5 — May 10, 2026 · Documentation & CI

**Work done:**
- Created `ARCHITECTURE.md` — Tech choices with justification tables
- Created `PRICING_DATA.md` — Pricing sources, URLs, verification dates, audit rules
- Created `PROMPTS.md` — Exact Gemini prompt with variable mapping
- Created `USER_INTERVIEWS.md` — 3 interviews with quotes and design changes
- Created `.github/workflows/ci.yml` — GitHub Actions CI pipeline
- Fixed `.gitignore` — Ensures all `.env` files are excluded from git

---

## Day 6 — May 11, 2026 · Polish & Accessibility

**Planned work:**
- Audit Lighthouse mobile scores (target: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90)
- Fix any ARIA issues found in automated audit
- Test form flow end-to-end in staging
- Add `<SkipToContent>` link for keyboard accessibility
- Verify all interactive elements have unique, descriptive IDs
- Test OG image generation in production environment

---

## Day 7 — May 12, 2026 · Deployment & Handoff

**Planned work:**
- Deploy Express server to Render (set environment variables)
- Deploy Next.js client to Vercel (set `NEXT_PUBLIC_API_URL`)
- Run Lighthouse on deployed mobile URL
- Write final README.md with setup instructions
- Submit with all deliverables complete
