# Devlog

## Day 1 — 2026-05-01
**Hours worked:** 0
**What I did:** Took the day off. Hadn't started the project yet.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** Initialize the repository.

## Day 2 — 2026-05-02
**Hours worked:** 0
**What I did:** Just set up the basic repository and pushed the `.gitignore` boilerplate.
**What I learned:** Basic project scaffolding.
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** Set up database configurations.

## Day 3 — 2026-05-03
**Hours worked:** 0
**What I did:** Pushed the basic Prisma edge setup file for the database.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** Add utility functions.

## Day 4 — 2026-05-04
**Hours worked:** 0
**What I did:** Added some formatting and JSDoc comments to the utilities. No deep work yet.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** Review the initial boilerplate.

## Day 5 — 2026-05-05
**Hours worked:** 0
**What I did:** Fixed a tiny TypeScript error in the initial setup. Getting ready for deep work tomorrow.
**What I learned:** N/A
**Blockers / what I'm stuck on:** Need to allocate real, continuous time to build the engine.
**Plan for tomorrow:** First day of deep work. Build the frontend and backend integration.

## Day 6 — 2026-05-06
**Hours worked:** 6
**What I did:** First major day of work. Built the interactive audit form in React, connected `localStorage`, and created the `/api/audit` backend endpoint with the Neon Postgres database. Integrated the Anthropic API for the executive summary.
**What I learned:** React state batching with nested arrays is tricky. Also, moving math to the deterministic rule engine instead of relying on the LLM to do math was a huge win. LLMs hallucinate numbers easily.
**Blockers / what I'm stuck on:** Wrapping my head around the overlap rules (e.g. Cursor vs Copilot).
**Plan for tomorrow:** Polish the audit engine rules, add tests, and finalize documentation.

## Day 7 — 2026-05-07
**Hours worked:** 5
**What I did:** Second major day of work. Refactored `audit.service.ts` to perfectly handle duplicate tool inputs and properly aggregate overlaps. Wrote automated tests using Vitest (9/9 passing). Set up GitHub Actions CI. Wrote all required rubric documentation (GTM, Economics, etc.).
**What I learned:** Thoroughly documenting decisions and unit economics takes almost as much mental effort as writing the code, but the product feels much more professional. Writing tests for deterministic logic is incredibly satisfying.
**Blockers / what I'm stuck on:** None. The project is ready for submission!
**Plan for tomorrow:** Rest.
