# Devlog

## Day 1 — 2026-05-06
**Hours worked:** 6
**What I did:** Received the assignment. Built the interactive audit form in React, connected `localStorage`, and created the `/api/audit` backend endpoint with the Neon Postgres database. Integrated the Anthropic API for the executive summary.
**What I learned:** React state batching with nested arrays is tricky. Also, moving math to the deterministic rule engine instead of relying on the LLM to do math was a huge win. LLMs hallucinate numbers easily.
**Blockers / what I'm stuck on:** Wrapping my head around the overlap rules (e.g. Cursor vs Copilot).
**Plan for tomorrow:** Polish the audit engine rules, add tests, and finalize documentation.

## Day 2 — 2026-05-07
**Hours worked:** 5
**What I did:** Refactored `audit.service.ts` to perfectly handle duplicate tool inputs and properly aggregate overlaps. Wrote automated tests using Vitest (9/9 passing). Wrote all required rubric documentation (GTM, Economics, etc.). Debugged and fixed a GitHub Actions CI pipeline failure caused by root directory cache mismatches, and resolved a strict TypeScript compile error in the frontend.
**What I learned:** CI/CD caching behaviors change significantly in monorepo-style folders without a root lockfile. Also, thoroughly documenting decisions and unit economics takes almost as much mental effort as writing the code, but the product feels much more professional. Writing tests for deterministic logic is incredibly satisfying.
**Blockers / what I'm stuck on:** None. The project is ready for submission!
**Plan for tomorrow:** Rest.

## Day 3 — 2026-05-11
**Hours worked:** 2
**What I did:** Refactored the landing page to extract monolithic UI sections (`Navbar`, `Hero`, `CTA`, `Footer`) into reusable components. Improved the codebase modularity and maintainability.
**What I learned:** Breaking down large Next.js pages into smaller components keeps the main page clean and makes future styling updates much easier. Next.js HMR sometimes throws "Router action dispatched before initialization" errors when moving components, but a simple restart clears it.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Final manual review and complete submission.
