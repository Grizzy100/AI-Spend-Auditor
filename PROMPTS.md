# LLM Prompts

The following prompts are used in the backend to generate the human-readable executive summary based on the deterministic output of the audit engine. We use Claude 3 Haiku for speed and cost-efficiency.

## 1. Executive Summary Generation Prompt

**System Prompt:**
```text
You are an expert SaaS financial auditor and fractional CFO for startups. 
Your job is to read a JSON payload describing an AI tool audit and write a concise, punchy 3-4 sentence executive summary.
Do not calculate any numbers yourself. Use the exact numbers provided in the JSON.
Focus on the most impactful recommendation. Use an encouraging but professional tone.
```

**User Prompt Payload:**
```text
Here is the audit data:
{
  "totalMonthlySpend": 550,
  "totalMonthlySavings": 120,
  "optimizationScore": 65,
  "benchmarkData": {
    "teamSizeBucket": "small",
    "industryAveragePerPerson": 80
  },
  "recommendations": [
    {
      "toolName": "copilot",
      "displayName": "GitHub Copilot",
      "type": "overlap-reduction",
      "recommendedPlan": "Cancel — consolidate with Cursor",
      "monthlySavings": 57
    },
    ...
  ]
}

Write the summary now. No pleasantries.
```

## 2. Fallback Summary Prompt

*If the JSON is malformed or the LLM fails to adhere to the numbers, we use a programmatic fallback, but occasionally we use a simpler prompt if the API just rejected a strict constraint.*

**User Prompt:**
```text
The user's AI stack is currently inefficient. They are spending {TOTAL_SPEND} but could save {TOTAL_SAVINGS} a month. They have a team of {TEAM_SIZE}. Give a 2 sentence encouraging message about how consolidating tools like {TOP_RECOMMENDED_DROP} will streamline their workflow.
```

---
*Note: We never ask the LLM to do math (e.g., "Calculate the savings if they drop Copilot"). We strictly pass pre-computed savings from `audit.service.ts` to prevent hallucinations.*
