# Product Metrics

To measure the success and growth of the AI Spend Auditor, we track the following metrics.

## North Star Metric
**Total Wasted Spend Identified (Cumulative)**
- **What it is:** The aggregate dollar amount (Annualized) of savings our audit engine has successfully recommended across all users.
- **Why it matters:** This directly correlates to the value we are providing the market. If 1,000 users run an audit, but we find $0 in savings, the tool is a novelty. If we find $1,000,000 in redundant spend, we have undeniable leverage to monetize (e.g., taking a 10% cut to negotiate those cancellations).

## Supporting Metrics

### 1. Audit Completion Rate (%)
- **What it is:** The percentage of users who land on the `/audit` page and successfully submit the form to get a `shareId`.
- **Why it matters:** The form requires users to manually look up their seats and spend. This is high friction. If the completion rate drops below 40%, we know the UX is too demanding and we need to pivot to an automated approach (e.g., CSV upload of credit card statements).

### 2. Report Share Rate (Virality)
- **What it is:** The percentage of generated audits that have their unique `shareId` URL opened by a different IP address than the creator.
- **Why it matters:** Our primary GTM relies on a "Roast My Stack" mechanic. If an engineering manager runs an audit, they need to send it to the VP of Finance to get approval for cancellations. A high share rate proves the report is useful as an internal communication tool.

### 3. False Positive Rate (User Corrections)
- **What it is:** How often users manually dismiss or dispute a recommendation (e.g., "Actually, I need both Cursor and Copilot").
- **Why it matters:** If the rule engine is too aggressive, users will lose trust in the tool. Tracking this allows us to refine the edge cases in `audit.service.ts`.
