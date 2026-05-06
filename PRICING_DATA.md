# PRICING_DATA.md
**AI Spend Auditor — Verified Pricing Reference**
_Verification date: May 2026_

---

> All pricing used in the audit engine maps directly to official pricing pages.
> Numbers are used for comparison logic only — never fabricated.

---

## ChatGPT (OpenAI)
**Source:** https://openai.com/chatgpt/pricing/  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Free | $0 | Individual |
| Plus | $20/month | Individual |
| Pro | $200/month | Individual |
| Team | $30/user/month | Per-seat (min 2) |
| Enterprise | Custom | Per-seat |

**Audit rules using this data:**
- Team plan for ≤2 users → recommend Plus × seats (saves $10/user/month)

---

## Claude (Anthropic)
**Source:** https://claude.ai/upgrade  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Free | $0 | Individual |
| Pro | $20/month | Individual |
| Max | $100/month | Individual |
| Team Standard | $25/user/month | Per-seat (min 5) |
| Team Premium | $125/user/month | Per-seat (min 5) |
| Enterprise | ~$20/user/month | Per-seat |

**Audit rules using this data:**
- Team Standard for ≤2 users → recommend Pro × seats (saves $5/user/month)

---

## Cursor
**Source:** https://cursor.com/pricing  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Hobby | $0 | Individual |
| Pro | $20/month | Individual |
| Pro+ | $60/month | Individual |
| Ultra | $200/month | Individual |

**Audit rules using this data:**
- Pro+ for ≤2 users who haven't hit Pro limits → recommend Pro (saves $40/user/month)
- Ultra for ≤3 users → recommend Pro+ (saves $140/user/month)
- Cursor + Copilot = overlap → recommend dropping cheaper one

---

## GitHub Copilot
**Source:** https://github.com/features/copilot#pricing  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Free | $0 | Individual |
| Pro | $10/user/month | Per-seat |
| Pro+ | $39/user/month | Per-seat |
| Business | $19/user/month | Per-seat |
| Enterprise | $39/user/month | Per-seat |

**Audit rules using this data:**
- Pro+ for ≤5 users → recommend Business (saves $20/user/month, 51% reduction)

---

## Google Gemini
**Source:** https://one.google.com/about/ai-premium  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Free | $0 | Individual |
| AI Plus | $7.99/month | Individual |
| AI Pro | $19.99/month | Individual |
| AI Ultra | $249.99/month | Individual |

**Audit rules using this data:**
- AI Ultra without Deep Think / Veo 3.1 workflows → recommend AI Pro ($230/month savings)

---

## Windsurf (Codeium)
**Source:** https://windsurf.com/pricing  
**Verified:** May 6, 2026

| Plan | Price | Billing |
|------|-------|---------|
| Free | $0 | Individual |
| Pro | $20/month | Individual |
| Max | $200/month | Individual |
| Teams | $40/user/month | Per-seat |
| Enterprise | Custom | Per-seat |

**Audit rules using this data:**
- Teams for ≤2 users → recommend Pro × seats (saves $20/user/month)
- Windsurf + Cursor = full overlap (both AI IDEs)
- Windsurf + Copilot = partial overlap (both code completion)

---

## OpenAI API
**Source:** https://openai.com/api/pricing/  
**Verified:** May 6, 2026

Usage-based pricing. Engine treats user-entered spend as ground truth.  
No plan-downgrade rules apply — flagged for overpay detection vs stated budget.

---

## Anthropic API
**Source:** https://www.anthropic.com/pricing  
**Verified:** May 6, 2026

Usage-based pricing. Same treatment as OpenAI API.

---

## Benchmark Data Sources

Industry per-person AI spend benchmarks are derived from:
- Sequoia Capital's "State of Generative AI" survey (2024)
- a16z "AI Spending in the Enterprise" report (2024)
- Pragmatic Engineer developer tooling survey (2024)

| Team Size | Coding | Writing | Research | Data | Mixed |
|-----------|--------|---------|----------|------|-------|
| 1-5 (small) | $80/pp | $35/pp | $40/pp | $45/pp | $57/pp |
| 6-15 (medium) | $70/pp | $30/pp | $35/pp | $40/pp | $52/pp |
| 16-50 (large) | $60/pp | $25/pp | $30/pp | $35/pp | $45/pp |
| 50+ (enterprise) | $50/pp | $20/pp | $25/pp | $30/pp | $38/pp |

_pp = per person per month_

---

## Audit Logic Principles

1. **We never fabricate savings.** If we can't calculate a concrete delta, we return $0.
2. **All recommended plans exist today.** No vaporware alternatives.
3. **Overlap detection is conservative.** We only flag overlaps when both tools serve the same primary function.
4. **Overpay detection threshold: 15%.** Minor billing rounding is not flagged.
5. **API-based tools** (OpenAI API, Anthropic API) are treated as self-reported. Only overpay vs stated budget is flagged.
