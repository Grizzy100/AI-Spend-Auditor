# AI Spend Auditor

AI Spend Auditor is a lightweight, edge-compatible web application designed for startup founders, engineering managers, and finance teams to identify overlapping and underutilized AI tool subscriptions. By analyzing a team's current AI stack, it provides actionable recommendations to consolidate tools, downgrade unused tiers, and negotiate better pricing based on official market rates.

## Demo & Deployment

- **Live Deployment:** [Deployed URL Placeholder - Replace Before Submission]
- **Walkthrough Video:** [Loom / YouTube Link Placeholder - Replace Before Submission]

*(Note: Replace the above links before submitting the assignment)*

### Screenshots
*(Add 3+ screenshots of the audit form, results page, and recommendations here)*
- `![Audit Form](./docs/screenshot1.png)`
- `![Results Page](./docs/screenshot2.png)`
- `![Recommendations](./docs/screenshot3.png)`

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (e.g., Neon or local pg instance)

### Install & Run Locally

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd ai-spend-auditor
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/ai_audit"
   ```

3. **Run the database migrations:**
   ```bash
   npx prisma db push
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:3000` and the server on `http://localhost:3001`.*

### Deploy

1. **Database:** Deploy a serverless Postgres database using Neon.
2. **Backend:** Deploy the Express API to a platform like Render or Railway.
3. **Frontend:** Deploy the Next.js client to Vercel, ensuring you set the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend.

## Decisions & Trade-offs

1. **Local Storage for Drafts vs. Database Persistence for In-Progress Audits:**
   *Why:* We chose to persist the audit form state using `localStorage` rather than saving drafts to the backend. This reduces database write load for incomplete funnels, ensures a snappy user experience, and allows users to seamlessly resume their audits without creating an account. The trade-off is that users cannot resume an audit across different devices.

2. **Rule-Based Engine vs. LLM for Spend Analysis:**
   *Why:* The core overlap and savings logic uses deterministic, hardcoded rules (e.g., `audit.service.ts`) instead of relying solely on an LLM to calculate savings. This guarantees mathematical accuracy, avoids hallucinations on pricing data, and executes instantly. We only use LLMs for generating a high-level summary paragraph. The trade-off is that adding new tools requires manual code updates rather than just prompting an LLM.

3. **Prisma with `adapter-pg` vs. Native Prisma Client:**
   *Why:* We utilized the `@prisma/adapter-pg` to ensure compatibility with serverless environments (like Vercel Edge Functions or Cloudflare Workers) and Neon Postgres. This modernizes our database access layer for edge-first deployments, trading slightly more initial configuration complexity for much better connection pooling and scaling.

4. **Monorepo-like Folder Structure vs. True Monorepo (Turborepo):**
   *Why:* We split the project into `client/` and `server/` folders within a single repository but avoided heavy monorepo tooling like Turborepo or Nx. This keeps the learning curve flat and deployment scripts simple (just pointing Vercel to `/client`). The trade-off is that sharing types between frontend and backend requires manual syncing or basic path mapping rather than a dedicated shared package.

5. **Client-Side Pricing Calculations vs. Backend-Only Validation:**
   *Why:* We duplicate some pricing constants on the frontend (`client/lib/pricing.ts`) to provide instant, real-time feedback as the user toggles plans and seats, without waiting for network requests. The trade-off is the risk of the client and server pricing logic drifting out of sync. To mitigate this, both source from matching configuration structures.
