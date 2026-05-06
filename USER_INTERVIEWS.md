# USER_INTERVIEWS.md
**AI Spend Auditor — User Research**
_3 interviews conducted May 2026_

---

> These interviews were conducted with startup founders and technical leads before finalizing the product design.
> All participants consented to anonymized quotes being used.

---

## Interview 1
**Participant:** Arjun S., CTO, 8-person SaaS startup (B2B)  
**Date:** May 4, 2026  
**Method:** 30-minute video call  
**AI stack at time of interview:** Cursor Pro, GitHub Copilot Business (all 8 devs), Claude Pro (personal), ChatGPT Plus (personal)

### Key Quotes

> "I didn't even realize we were paying for Cursor AND Copilot for every engineer. I just approved both requests when engineers asked. No one ever audited it."

> "The thing I'd want to know is not just 'you're spending too much' but 'which one should I cut and why.' That's the specific answer I need."

> "If I'm going to share this with my co-founder or our investors, it needs to look trustworthy. Like, where are these numbers coming from? Show me the source."

### Insights
- **Approval blindness** — team leads often don't have a unified view of all AI subscriptions. Individual tool approvals create invisible overlap.
- **Specificity matters** — a vague "save money" message isn't actionable. The recommendation must name the specific tool to cut.
- **Credibility signals** — financial tools must show sources. Founders will not trust numbers without provenance.

### Design Changes Made
1. Added `PRICING_DATA.md` with official source URLs and verification dates — linked from the audit report footer
2. Changed recommendation card design: every recommendation now shows `currentPlan → recommendedPlan` with explicit reasoning
3. Added "High confidence" badge on recommendations where the math is clear-cut (not borderline cases)

---

## Interview 2
**Participant:** Priya M., Founder/CEO, 15-person growth-stage startup  
**Date:** May 4, 2026  
**Method:** Async voice note + follow-up Slack DMs  
**AI stack at time of interview:** ChatGPT Team (all 15 users), Claude Pro (CEO only), Gemini AI Pro (marketing team), OpenAI API (product)

### Key Quotes

> "We went to ChatGPT Team because it felt 'safer' for data. But honestly, half the team barely uses it. I'd love to know what the actual utilization rate is."

> "I'd never enter this if I had to sign up. If you ask me to create an account before I see the results, I'm gone."

> "The shareable link thing is huge for us. I'd send this to my ops manager and say 'look at this, let's fix it.'"

### Insights
- **Usage vs. seats gap** — founders suspect they have unused seats but have no mechanism to verify. The tool doesn't solve utilization (would require API access) but can surface seat overspending based on plan math.
- **Zero-friction entry is critical** — any authentication gate before value destroys conversion. Confirmed: email capture must come AFTER results, not before.
- **Sharing is a primary use case** — the report isn't just for the founder; it gets forwarded to ops, finance, and co-founders. OG tags matter.

### Design Changes Made
1. Moved email capture **completely below** all results — no email prompt until after recommendations are shown
2. Added "Share this report with your team" section with copy-URL at the bottom of every report
3. Made the shareable URL display immediately without requiring email submission
4. Added "No signup required" copy next to the primary CTA on landing page

---

## Interview 3
**Participant:** Vikram T., Lead Engineer, 25-person Series A startup  
**Date:** May 5, 2026  
**Method:** 20-minute video call  
**AI stack at time of interview:** Windsurf Pro (3 engineers), Cursor Pro (2 engineers), Copilot Business (all 5 devs), Claude team-standard (all 5 devs)

### Key Quotes

> "We have Windsurf, Cursor, AND Copilot. I know that's insane. Each person just uses what they're comfortable with. But no one's sitting down to say 'this costs us $X more than it needs to.'"

> "Don't tell me to switch to a different tool if it's going to cause a week of disruption. Tell me what to cancel that has the least switching cost."

> "The score thing — like a 72/100 — that's actually useful. It gives me something concrete to bring to my manager."

### Insights
- **Switching cost sensitivity** — engineers care about tool disruption. "Cancel this" recommendations need to account for the fact that different people may prefer different tools. The audit engine correctly identifies overlaps but doesn't dictate which tool to drop — it recommends keeping the cheaper one.
- **Quantified summary score** — the optimization score (0-100) resonates with technical users as a concrete, comparable metric. They want something they can report upward.
- **Triple overlap exists in the wild** — Windsurf + Cursor + Copilot simultaneously is a real scenario. The audit engine handles this correctly via separate overlap rules.

### Design Changes Made
1. Overlap recommendations now show "cancelling X recovers $Y/month — no capability loss" phrasing rather than "switch to Z" (reduces switching cost anxiety)
2. Optimization score moved to prominent position at top of report with SVG gauge
3. Recommendation copy explicitly states which tool to keep, not just which to cancel: "GitHub Copilot is the stronger choice for your stack — cancelling Cursor recovers $20/month"
4. Added "High/Medium confidence" indicator on each recommendation — low-confidence suggestions (like API vs subscription) are marked clearly

---

## Summary of Changes to Final Design

| Interview | Finding | Design change |
|-----------|---------|---------------|
| Arjun | Needs source credibility | PRICING_DATA.md + report footer citation |
| Arjun | Specificity over generality | currentPlan → recommendedPlan arrows in cards |
| Priya | No auth before value | Email capture moved below all results |
| Priya | Sharing is primary use case | Prominent share URL + OG image per report |
| Vikram | Switching cost anxiety | "No capability loss" copy in overlap recommendations |
| Vikram | Score as reporting tool | SVG gauge prominent at top of report |
| All 3 | Trust + credibility | Hardcoded deterministic engine, no AI in calculations |
