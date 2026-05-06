# Reflection
**AI Spend Auditor**

## 1. The hardest bug you hit this week, and how you debugged it
The hardest bug was dealing with Prisma v7's breaking change regarding the `DATABASE_URL`. I initially had the `url = env("DATABASE_URL")` inside the `datasource db {}` block in `schema.prisma`, which has been standard practice for years. When I ran `npx prisma generate`, it threw an opaque error about the driver adapter and missing URL.
*Hypothesis 1:* The `.env` file wasn't being read by Express. I added `console.log(process.env.DATABASE_URL)` and it printed correctly.
*Hypothesis 2:* The Neon driver adapter (`@prisma/adapter-neon`) was incorrectly configured.
*Solution:* I dug into the Prisma v7 upgrade guide and realized that in v7, you must extract the connection logic into a separate `prisma.config.ts` file when using driver adapters, and remove the `url` from the schema entirely. Implementing this fixed the connection pooler immediately.

## 2. A decision you reversed mid-week, and what made you reverse it
I originally planned to use Next.js API routes (App Router) for the entire backend. I reversed this decision on Day 2 and built a separate Express.js server instead.
What made me reverse it was the realization that testing a complex financial deterministic engine (the audit logic) inside the Next.js edge runtime is unnecessarily difficult. I wanted to use Vitest to run lightning-fast unit tests on the math. By separating the audit engine into an Express/Node.js environment, I could run `npm test` and get sub-second feedback on 9 different overlap rules without waiting for the Next.js bundler. It also forced me to define strict Zod boundaries between the client and server.

## 3. What you would build in week 2 if you had it
If I had Week 2, I would build the **PDF export** and the **Embeddable widget**.
Right now, the shareable URL is great for Slack, but enterprise CFOs want a PDF report they can attach to an expense review Jira ticket. I would use `puppeteer` or `jsPDF` to generate a branded one-pager.
The embeddable widget would be a massive growth loop. I'd create an `<iframe src=".../widget">` that tech bloggers (like Gergely Orosz) could embed in their substack articles about "State of AI tools." It would let their readers run a mini-audit directly inline, funneling massive high-intent traffic back to Credex.

## 4. How you used AI tools
- **Tools used:** Gemini 1.5 Pro (for ideation and copy), Cursor (for autocomplete).
- **What I trusted them with:** Generating the boilerplate tailwind CSS variables for the dark mode theme, and scaffolding the boilerplate Express server setup (Helmet, CORS, Rate limiting).
- **What I didn't trust them with:** The actual financial audit logic. AI is terrible at writing deterministic accounting rules.
- **When the AI was wrong:** I asked Gemini to write a regex to validate the `shareId` in the URL. It gave me `/^[a-zA-Z0-9]{10}$/`. However, I was using `nanoid(10)`, which uses the `_` and `-` characters by default. If I had blindly trusted the AI regex, the report pages would have 404'd on certain IDs. I caught it by checking the `nanoid` docs and updating the regex to include `_-`.

## 5. Self-rating on a 1–10 scale
- **Discipline (9/10):** Maintained strict separation of concerns, wrote tests before UI, and documented everything in markdown.
- **Code quality (8/10):** The audit engine is highly testable and pure, but the Next.js `ReportClient.tsx` component is a bit bloated (350+ lines) and could be broken down into smaller sub-components.
- **Design sense (9/10):** Built a premium, dark-mode glassmorphism UI from scratch without using pre-built dashboard templates. It looks like a real SaaS product.
- **Problem solving (9/10):** Navigated the Prisma v7 breaking changes effectively and built a defensible, non-AI rule engine for the math.
- **Entrepreneurial thinking (10/10):** Put massive effort into the GTM and Economics docs. Realized the tool is useless if it doesn't convert, so I placed the email capture *after* the value delivery to maximize the funnel.
