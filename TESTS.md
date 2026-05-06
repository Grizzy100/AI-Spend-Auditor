# TESTS.md
**AI Spend Auditor**

## Automated Tests Suite
We use **Vitest** for all server-side logic testing because it provides a fast, native ESM environment which perfectly suits our Prisma v7 setup.

### How to run the tests
```bash
cd server
npm install
npm test
```

### Test Coverage (9 Tests)

**File:** `server/src/tests/audit.test.ts`

**1. `calculates basic overpay correctly when usage exceeds benchmark`**
- *Coverage:* Tests the core `overpayDetectionRule`. Ensures that if a user reports spending $2000 on a plan that should cost $1000, the $1000 delta is flagged as a high-confidence saving.

**2. `identifies cursor + copilot overlap`**
- *Coverage:* Tests `cursorCopilotOverlapRule`. Ensures that if a team uses both Cursor Pro and Copilot Business, the engine recommends keeping the cheaper one (Copilot in this test case) and flags the Cursor cost as recoverable waste.

**3. `recommends pro upgrades instead of team plans for small seats`**
- *Coverage:* Tests `planDowngradeRule`. Validates that a 2-person team on ChatGPT Team ($30/mo) is recommended to downgrade to ChatGPT Plus ($20/mo), as Team plans usually require 5+ seats to be worth the enterprise features.

**4. `handles windsurf and cursor overlap`**
- *Coverage:* Tests `cursorWindsurfOverlapRule`. Ensures that having two full AI IDEs is flagged as 100% redundant, recommending the cancellation of the more expensive option.

**5. `calculates optimization score correctly`**
- *Coverage:* Validates the 0-100 `optimizationScore` math. A perfectly optimal stack should score near 100, while a stack with 50% waste should score significantly lower.

**6. `determines correct benchmark percentile`**
- *Coverage:* Tests `benchmarkRule`. Compares a 10-person engineering team spending $80/dev against the hardcoded `$70/pp` industry benchmark, ensuring they land in the correct percentile bracket.

**7. `handles missing or zero spend gracefully`**
- *Coverage:* Edge case test. Ensures the audit engine does not crash or throw NaN errors if a user inputs $0 spend or leaves optional fields blank.

**8. `identifies claude team and chatgpt team overlap`**
- *Coverage:* Tests `claudeChatGptTeamOverlapRule`. Having both premium LLM team plans is often redundant for general use cases.

**9. `does not flag API usage as overlap with UI subscriptions`**
- *Coverage:* Tests `apiVsSubscriptionRule`. Ensures that a team paying for OpenAI API *and* ChatGPT Plus is NOT flagged as an overlap, since API usage (production) and UI usage (internal) serve different purposes.
