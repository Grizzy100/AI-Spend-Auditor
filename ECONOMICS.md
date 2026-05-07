# Unit Economics

To ensure the AI Spend Auditor can operate sustainably at scale, we must analyze the exact cost of running a single audit.

## Cost Per Audit (CPA)

1. **LLM Cost (Anthropic Claude 3 Haiku)**
   - **Input tokens:** ~300 tokens (JSON payload + system prompt) = $0.000075
   - **Output tokens:** ~100 tokens (3-4 sentence summary) = $0.000125
   - **Total LLM cost:** **$0.0002 per audit**

2. **Database Cost (Neon Postgres)**
   - Neon charges based on active compute time and storage.
   - For a single insert (`shareId`, raw JSON, summary), the compute time is virtually zero. Assuming we fit within the free tier for the first 100k audits.
   - At scale: ~$0.00001 per write.

3. **Compute Cost (Vercel Edge/Serverless)**
   - API execution time: ~1.5s (mostly waiting for the LLM).
   - Vercel Free tier handles 100k serverless function executions. At scale on Pro, it costs roughly $0.00002 per invocation.

**Total Hard Cost per Audit: ~$0.00023**

## Value Proposition & Monetization

If we run 10,000 audits per day, our daily infrastructure cost is exactly **$2.30**.

### Why is this economically viable?
We don't need to charge for the audit itself. The audit acts as a **lead magnet**. 

- **Average Savings Found:** $120/month ($1,440/year).
- **Monetization Strategy:** Instead of charging a subscription, the final audit report includes an option: *"Hire us to negotiate and cancel these for you."* We take a 20% cut of the first year's savings.
- If only 1% of users opt-in (100 out of 10,000), and the average savings is $1,440, we capture **$288 per customer**. 
- 100 customers * $288 = **$28,800/day in gross revenue**, against **$2.30 in compute costs**. 

The unit economics of using a lightweight edge function and Haiku (instead of Opus or GPT-4) make this highly profitable as a lead generation tool.
