# Devlog

## Day 1 — 2026-05-01
**Hours worked:** 2
**What I did:** Read the prompt, sketched out the system architecture on paper, and evaluated the market rates for AI tools. Set up the base Next.js and Node.js repositories.
**What I learned:** I realized that fetching pricing dynamically via scraping would be too brittle and slow for an audit engine, so I decided to hardcode a pricing configuration file that serves as the "source of truth."
**Blockers / what I'm stuck on:** Trying to decide whether to use a true monorepo (Turborepo) or just two separate folders.
**Plan for tomorrow:** Build the frontend form and local state management.

## Day 2 — 2026-05-02
**Hours worked:** 4
**What I did:** Built the interactive audit form in React. Implemented the dynamic row addition and deletion for the user's AI stack. Connected `localStorage` to save incomplete audits.
**What I learned:** React state batching can be tricky when updating nested arrays (like a list of tools) alongside aggregate totals. I learned how to structure immutable state updates more cleanly.
**Blockers / what I'm stuck on:** The UI looks a bit bland. I need to spend time polishing the CSS and animations.
**Plan for tomorrow:** Build the backend rule engine.

## Day 3 — 2026-05-03
**Hours worked:** 5
**What I did:** Wrote the `audit.service.ts` logic. Implemented rules for identifying overspending, wrong plans for team sizes, and overlaps between tools (e.g., Cursor vs. Copilot).
**What I learned:** I learned that overlap logic is heavily dependent on aggregating spend accurately, rather than just finding the first matching tool in the array. 
**Blockers / what I'm stuck on:** Figuring out how to deduplicate recommendations if the user inputs the same tool twice.
**Plan for tomorrow:** Connect the frontend to the backend API and setup Prisma.

## Day 4 — 2026-05-04
**Hours worked:** 3
**What I did:** Set up Neon Postgres and Prisma using the `@prisma/adapter-pg`. Built the `/api/audit` Express endpoint. Connected the frontend form submission to the backend.
**What I learned:** The `adapter-pg` is fantastic for serverless environments. It completely removes the connection pooling headache I usually face with Vercel and Postgres.
**Blockers / what I'm stuck on:** None today. The database integration went smoothly.
**Plan for tomorrow:** Add LLM integration for the executive summary.

## Day 5 — 2026-05-05
**Hours worked:** 4
**What I did:** Integrated the Anthropic API to generate a personalized executive summary based on the raw JSON output of the audit engine. Added error handling and fallback logic.
**What I learned:** LLMs are bad at math. I originally tried to let the LLM calculate the savings, but it hallucinated numbers. Moving the math to the deterministic rule engine and only using the LLM for text was a huge win.
**Blockers / what I'm stuck on:** The API can occasionally be slow (3-4 seconds), which makes the form submission feel laggy.
**Plan for tomorrow:** Write automated tests and refine the UI loading states.

## Day 6 — 2026-05-06
**Hours worked:** 3
**What I did:** Wrote 9 automated tests using Vitest to cover the audit engine. Added loading spinners and honeypot validation to the frontend to prevent bot spam.
**What I learned:** Writing tests for deterministic logic is incredibly satisfying. It caught an edge case where small teams on ChatGPT Team were actually overpaying compared to individual Plus accounts.
**Blockers / what I'm stuck on:** Wrapping up the remaining documentation.
**Plan for tomorrow:** Finalize all documentation, edge case handling, and Git history compliance.

## Day 7 — 2026-05-07
**Hours worked:** 3
**What I did:** Finalized all rubric documentation (README, ARCHITECTURE, DEVLOG, GTM, etc.). Refactored the audit engine to perfectly handle duplicate tool inputs and properly aggregate overlap costs. Set up GitHub Actions CI.
**What I learned:** Thoroughly documenting decisions and unit economics takes almost as much mental effort as writing the code, but it makes the final product feel much more professional.
**Blockers / what I'm stuck on:** None. The project is ready for submission.
**Plan for tomorrow:** Rest.
