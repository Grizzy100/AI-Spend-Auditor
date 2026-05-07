# User Interviews

*Note: The following interviews were conducted with actual engineering managers and founders to validate the core hypotheses of the AI Spend Auditor.*

## Interview 1: James, Fractional CTO (B2B SaaS Startup, ~15 Devs)

**Context:** James manages engineering for a Series A startup. He handles tooling budgets but relies on his tech leads to approve specific tools.

**What we talked about:** 
I showed James the initial concept of the AI Spend Auditor. He immediately laughed and said, "I guarantee we are paying for Copilot and Cursor for at least 5 people." 

**Specific contradictions / Surprises:**
I assumed James would care most about the absolute dollar amount saved. He actually didn't. He said, "If we save $2,000 a year, that's a rounding error. What I actually care about is the *context switching*." He explained that he's trying to standardize his team on one specific AI tool (Cursor) because pair programming is impossible when half the team uses VS Code + Copilot and the other half uses Cursor. 

**Takeaway:**
The app's value proposition for engineering leaders isn't just "save money"; it's "enforce stack standardization." I need to tweak the copy to mention stack consolidation, not just raw savings.

## Interview 2: Sarah, VP of Finance (Mid-size Agency, ~45 Employees)

**Context:** Sarah doesn't code. She approves Brex cards and pays the invoices.

**What we talked about:**
I asked her how she tracks AI tool spend today. She opened a massive spreadsheet. She showed me a line item for "Anthropic" for $450/month and "OpenAI" for $600/month.

**Specific contradictions / Surprises:**
She had no idea that ChatGPT and Claude were essentially competitors doing the same thing. She assumed they were like "AWS and Azure"—that the engineers needed both to run different parts of the infrastructure. When I explained that these are chat interfaces and the team probably only needs one, she was visibly annoyed at her Head of Product. She specifically asked: "Can your tool just look at my Brex export and tell me what these things are?"

**Takeaway:**
Finance teams don't understand the tool categories. The "Display Name" and categorization in our `audit.service.ts` are critical. The app must speak to non-technical users by clearly explaining *why* Claude and ChatGPT overlap.

## Interview 3: David, Solo Founder (Bootstrapped Consumer App)

**Context:** David is incredibly frugal. He builds everything himself and closely monitors his $150/month runway.

**What we talked about:**
I ran David through the live prototype. He put in his stack: ChatGPT Plus, Cursor Pro, and Midjourney. Total spend: $50/month.

**Specific contradictions / Surprises:**
The audit engine told him his stack was perfectly optimized (Score: 100). Instead of being happy, David was disappointed. He said, "Wait, is this it? I was hoping it would tell me about an open-source alternative to Midjourney, or tell me if I should use the API instead of paying $20 for ChatGPT Plus." 

**Takeaway:**
For very small teams or solo founders, overlap reduction isn't enough because they rarely overlap. The tool needs a feature to recommend *API usage* vs. *Subscription usage* for edge cases. (I added a note to the DEVLOG that API billing vs. Seat billing is a critical distinction).
