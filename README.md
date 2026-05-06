# AI Spend Auditor

> Find hidden waste in your AI subscriptions in 2 minutes. Built for startup founders and engineering managers who pay for AI tools but have no benchmark for what's reasonable.

A free audit tool by [Credex](https://credex.rocks) that analyzes your AI tool stack (Cursor, ChatGPT, Claude, Copilot, Gemini, etc.), identifies plan mismatches and redundant overlaps, and produces a shareable report showing exactly how much you can save — with specific, defensible recommendations backed by real pricing data.

---

## Screenshots

> _Add 3 screenshots here before submission — or a 30-second Loom recording link_
> 
> Suggested: Landing page hero · Audit form with tools entered · Report page with savings breakdown

---

## Live URL

> _Add Vercel/Render deployed URL here_

---

## Quick Start

### Prerequisites
- Node.js ≥ 20
- npm ≥ 9
- A [Neon](https://neon.tech) PostgreSQL database
- A [Google Gemini](https://aistudio.google.com) API key
- A [Resend](https://resend.com) account for email

### 1. Clone and install

```bash
git clone https://github.com/Grizzy100/AI-Spend-Auditor.git
cd AI-Spend-Auditor
```

### 2. Set up the server

```bash
cd server
cp .env.example .env
# Fill in your credentials in .env
npm install
npx prisma db push        # sync schema to Neon
npm run dev               # starts on http://localhost:3001
```

### 3. Set up the client

```bash
cd ../client
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev               # starts on http://localhost:3000
```

### 4. Run tests

```bash
cd server
npm test                  # 9 audit engine tests, all should pass
```

### Deploy

| Service | What |
|---------|------|
| [Render](https://render.com) | Deploy `server/` as a Node.js web service |
| [Vercel](https://vercel.com) | Deploy `client/` — set `NEXT_PUBLIC_API_URL` to your Render URL |

---

## Decisions

Five meaningful trade-offs made during this build:

**1. Express over Next.js API routes**  
The audit engine + Prisma v7 + Vitest needed a clean Node.js environment to run tests against without Next.js bundler interference. Separating the API also means it can be versioned independently and reused if we ever add a mobile client. Trade-off: two deployments instead of one.

**2. Deterministic audit engine — no AI for calculations**  
Founders need to trust the numbers. If Gemini said "you could save $340/month," a savvy founder would ask "how?" Using hardcoded rules based on published pricing pages means every recommendation traces to an official source. AI is only used for the summary paragraph, never for the math.

**3. Prisma v7 over v5/v6**  
v7 is a breaking change (requires `prisma.config.ts`, removes `url` from schema, forces driver adapters). Chose it anyway because Neon's serverless driver adapter is the recommended path for serverless-friendly connection pooling. The extra setup cost upfront pays off in production reliability.

**4. Email capture after results, not before**  
Every conversion optimization study shows pre-gating kills trust for free tools. We show full value first — all recommendations, all savings numbers, the AI summary — then ask for email. This aligns with the brief and is the right call for a lead-gen product. Trade-off: slightly lower email capture rate vs higher trust.

**5. Honeypot over hCaptcha for abuse protection**  
hCaptcha adds 100-200ms latency and visually signals "we don't trust you" — terrible UX for a zero-friction free tool. A honeypot field (hidden from real users, filled by bots) combined with server-side rate limiting (10 req/min per IP) is sufficient for MVP volume. Trade-off: sophisticated bots can bypass honeypots; hCaptcha would be added at scale.
