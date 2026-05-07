# Automated Tests

The AI Spend Auditor utilizes **Vitest** for fast, reliable unit testing. We currently have 9 automated tests specifically covering the business logic and edge cases within the deterministic Audit Engine.

## How to Run the Tests

To run the test suite locally, execute the following command from the root directory or the `server` directory:

```bash
npx vitest run server/src/tests/audit.test.ts
```

## Test Coverage

| File | Test Description | What it Covers |
| :--- | :--- | :--- |
| `audit.test.ts` | **Detects ChatGPT Team plan overspending for ≤2 seats** | Ensures the engine flags small teams (under 2 seats) paying for the 'Team' plan, as it is more expensive than buying individual 'Plus' accounts. |
| `audit.test.ts` | **Calculates total monthly and annual savings correctly** | Validates the core math functions ensuring that `totalMonthlySavings` exactly matches the sum of individual tool savings, and annual savings are computed precisely. |
| `audit.test.ts` | **Detects Cursor and GitHub Copilot overlap** | Verifies the redundancy rule `ruleOverlapCursorCopilot`. Recommends dropping the more expensive tool when both a dedicated AI IDE and a general autocomplete tool are present. |
| `audit.test.ts` | **Detects Claude Team and ChatGPT Team overlap** | Verifies the redundancy rule `ruleOverlapClaudeChatGPT`. Prevents companies from paying for duplicate premium chat interfaces for the same team. |
| `audit.test.ts` | **Generates benchmark data for small coding team** | Ensures that the benchmark percentiles and industry average logic accurately bucket the company size and calculate reasonable comparisons. |
| `audit.test.ts` | **Generates optimization score between 10 and 100** | Validates the boundary limits of the proprietary `optimizationScore` calculation for a highly unoptimized, bloated stack. |
| `audit.test.ts` | **Returns high score for an already optimized stack** | Confirms that a lean stack (e.g., a single seat of Cursor Pro) yields an optimization score of 85+ with $0 in recommended savings. |
| `audit.test.ts` | **Generates a unique shareId for each audit** | Verifies the `generateShareId` utility reliably produces distinct 8-character unique identifiers for sharing report URLs. |
| `audit.test.ts` | **Detects when user is overpaying versus official market rate** | Confirms the `calcMarketRate` logic accurately flags users who manually input spend amounts vastly exceeding the official vendor list price. |
