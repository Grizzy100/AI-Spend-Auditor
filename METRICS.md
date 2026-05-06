# Metrics
**AI Spend Auditor**

## North Star Metric
**Number of Qualified Consultations Booked per Month**

**Why:** Because this is a B2B lead-generation tool for Credex, not a standalone consumer SaaS. If 100,000 people use the tool but no one books a consultation to buy discounted credits, the tool has failed its primary business objective. Traffic and audits are vanity metrics; booked consultations from high-savings users ($500+/mo) equal revenue.

## 3 Input Metrics (That drive the North Star)

1. **Audit Completion Rate:** (Audits Completed / Unique Visitors). 
   - *Why:* If the form is too complex or lacks trust, visitors will bounce before seeing the value. Target: >15%.
2. **High-Savings Discovery Rate:** (Audits with >$500/mo savings / Total Audits).
   - *Why:* This measures if the tool's logic is actually finding the right users for Credex. If this is 0%, we are targeting the wrong audience (e.g., solo devs instead of 50-person startups). Target: >10%.
3. **Email Capture Rate on High-Savings Audits:** (Emails Captured / High-Savings Audits).
   - *Why:* This measures the effectiveness of the results page and the Credex CTA. If they see $5,000 in savings but don't enter their email, the UI failed to build trust or the CTA was weak. Target: >20%.

## What I'd Instrument First
Using PostHog or Amplitude, I would immediately instrument the funnel events:
- `Page_View` (Landing page)
- `Form_Started` (Typed in the first input)
- `Audit_Generated` (Server returned the payload)
- `Report_Viewed` (Client rendered the results)
- `Email_Captured` (Lead submitted)
- `Share_Link_Copied` (Crucial for tracking the viral loop)

## Pivot Decision Trigger
**Trigger:** If the *Audit Completion Rate* is healthy (>15%) BUT the *High-Savings Discovery Rate* is <2% after 1,000 audits.
**Decision:** We would need to pivot our Go-To-Market distribution strategy immediately. It would mean our traffic consists entirely of solo developers or hobbyists (who don't spend enough to trigger the Credex threshold). We would stop organic Twitter posts and pivot strictly to outbound cold email targeting Series A CTOs.
