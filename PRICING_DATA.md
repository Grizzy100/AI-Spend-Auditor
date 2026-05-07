# Pricing Data Sources

The accuracy of AI Spend Auditor relies entirely on keeping the `pricing.ts` catalog in sync with vendor updates. Below is the source of truth for the data used in the application.

*All prices last verified on: **May 1, 2026***

## ChatGPT (OpenAI)
- **Source:** [https://openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)
- **Plus Plan:** $20/month per user.
- **Team Plan:** $30/month per user (billed monthly). Note: There is a 2-seat minimum. Our engine assumes users who select 'Team' with 1 seat are actually violating the TOS or paying for 2 seats, so the engine flags it.

## Claude (Anthropic)
- **Source:** [https://claude.ai/pricing](https://claude.ai/pricing)
- **Pro Plan:** $20/month per user.
- **Team Standard:** $30/month per user (billed monthly). 5-seat minimum requirement.

## GitHub Copilot
- **Source:** [https://github.com/features/copilot#pricing](https://github.com/features/copilot#pricing)
- **Individual Plan:** $10/month.
- **Business Plan:** $19/month per user.

## Cursor
- **Source:** [https://www.cursor.com/pricing](https://www.cursor.com/pricing)
- **Hobby:** Free.
- **Pro:** $20/month.
- **Ultra:** $60/month.

## Windsurf (Codeium)
- **Source:** [https://codeium.com/pricing](https://codeium.com/pricing)
- **Free:** $0/month.
- **Pro:** $20/month.
- **Enterprise:** Usage-based (contact sales).

## Midjourney
- **Source:** [https://docs.midjourney.com/docs/plans](https://docs.midjourney.com/docs/plans)
- **Basic:** $10/month.
- **Standard:** $30/month.
- **Pro:** $60/month.
- **Mega:** $120/month.

---
**Note for Maintainers:** Any update to these prices must be reflected in `client/lib/pricing.ts` and ideally pushed via a single unified configuration file in the future.
