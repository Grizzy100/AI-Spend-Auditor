# PROMPTS.md
**AI Spend Auditor — LLM Prompt Reference**

---

## Context

AI is used in **exactly one place** in this product: generating a personalized executive summary on the report page.

The audit engine itself (`server/src/services/audit.service.ts`) is **fully deterministic** — no AI, no LLM, no probabilistic logic. All financial calculations are based on hardcoded, verified pricing data.

---

## Gemini Summary Prompt

**Model:** `gemini-1.5-flash`  
**Location:** `server/src/services/gemini.service.ts`  
**Trigger:** Called once per audit, after the deterministic engine runs  
**Purpose:** Generate a 90-100 word executive summary based on audit output  
**Failure mode:** Falls back to a deterministic template summary — never fails silently

### System Context (injected as preamble)

```
You are a financial advisor specializing in SaaS and AI cost optimization for startups.
```

### User Prompt Template

```
Based on this AI spend audit, write a concise 90-100 word executive summary paragraph.

Rules:
- Be specific: mention exact dollar amounts, tool names, and actionable steps
- Sound financially intelligent, premium, and credible
- Use confident, decisive language
- Do NOT use bullet points or markdown — one flowing paragraph only
- End with a brief mention of the opportunity to optimize further

Audit data:
- Total tools: {toolCount}
- Monthly spend: ${totalMonthlySpend}
- Monthly savings possible: ${totalMonthlySavings}
- Annual savings possible: ${totalAnnualSavings}
- Efficiency score: {optimizationScore}/100
- Benchmark percentile: {benchmarkPercentile}th (lower = more expensive than peers)
- Biggest inefficiency: {biggestInefficiency}
- Top recommendations: {topRecommendations}

Return only the paragraph, no markdown, no preamble.
```

### Variables Injected

| Variable | Source |
|----------|--------|
| `toolCount` | `AuditResult.tools.length` |
| `totalMonthlySpend` | `AuditResult.totalMonthlySpend` (USD, deterministic) |
| `totalMonthlySavings` | `AuditResult.totalMonthlySavings` (USD, deterministic) |
| `totalAnnualSavings` | `AuditResult.totalAnnualSavings` (USD, deterministic) |
| `optimizationScore` | `AuditResult.optimizationScore` (0-100, deterministic) |
| `benchmarkPercentile` | `AuditResult.benchmarkPercentile` (deterministic) |
| `biggestInefficiency` | `AuditResult.biggestInefficiency` (deterministic string) |
| `topRecommendations` | Top 3 recs by savings (deterministic) |

---

## Fallback Summary (No API Key / API Failure)

If `GEMINI_API_KEY` is not set, or if the API call fails for any reason, the system generates a deterministic fallback:

### Fallback Template (no savings found)
```
Your AI stack of {toolCount} tool(s) appears well-optimized with an efficiency score of 
{score}/100. Your spend per person aligns with industry benchmarks for teams of your size. 
No immediate action is required — continue monitoring as your team scales and new AI tools 
enter the market.
```

### Fallback Template (savings found)
```
Your AI stack audit reveals ${annualSavings}/year in optimization opportunities across 
{toolCount} tool(s). With an efficiency score of {score}/100, there are clear inefficiencies 
to address. {topRecReason}. Consolidating overlapping subscriptions and right-sizing plans 
to your team's actual usage would bring your per-person AI spend in line with top-performing 
startups. Credex recommends acting on these findings within the next billing cycle.
```

---

## Why Gemini Flash?

- **Cost:** ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens. A 100-word summary costs ~$0.0001 per audit.
- **Speed:** Significantly faster than Pro models — sub-2s response for this prompt.
- **Quality:** Sufficient for a structured, constrained summarization task with explicit format rules.
