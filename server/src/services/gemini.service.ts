import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import type { AuditResult } from './audit.service';

const FALLBACK_SUMMARY = (result: AuditResult): string => {
  const savings = result.totalAnnualSavings;
  const score = result.optimizationScore;
  const toolCount = result.tools.length;

  if (savings === 0) {
    return `Your AI stack of ${toolCount} tool${toolCount !== 1 ? 's' : ''} appears well-optimized with an efficiency score of ${score}/100. Your spend per person aligns with industry benchmarks for teams of your size. No immediate action is required — continue monitoring as your team scales and new AI tools enter the market.`;
  }

  const topRec = result.recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.annualSavings - a.annualSavings)[0];

  return `Your AI stack audit reveals $${savings.toLocaleString()}/year in optimization opportunities across ${toolCount} tool${toolCount !== 1 ? 's' : ''}. With an efficiency score of ${score}/100, there are clear inefficiencies to address. ${topRec ? `The largest opportunity is ${topRec.displayName} — ${topRec.reasoning.split('.')[0]}.` : ''} Consolidating overlapping subscriptions and right-sizing plans to your team's actual usage would bring your per-person AI spend in line with top-performing startups. Credex recommends acting on these findings within the next billing cycle.`;
};

export const generateAISummary = async (result: AuditResult): Promise<string> => {
  if (!env.GEMINI_API_KEY) {
    console.warn('[Gemini] No API key configured — using fallback summary');
    return FALLBACK_SUMMARY(result);
  }

  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a financial advisor specializing in SaaS and AI cost optimization for startups.

Based on this AI spend audit, write a concise 90-100 word executive summary paragraph.

Rules:
- Be specific: mention exact dollar amounts, tool names, and actionable steps
- Sound financially intelligent, premium, and credible
- Use confident, decisive language
- Do NOT use bullet points or markdown — one flowing paragraph only
- End with a brief mention of the opportunity to optimize further

Audit data:
- Total tools: ${result.tools.length}
- Monthly spend: $${result.totalMonthlySpend}
- Monthly savings possible: $${result.totalMonthlySavings}
- Annual savings possible: $${result.totalAnnualSavings}
- Efficiency score: ${result.optimizationScore}/100
- Benchmark percentile: ${result.benchmarkPercentile}th (lower = more expensive than peers)
- Biggest inefficiency: ${result.biggestInefficiency}
- Top recommendations: ${result.recommendations
  .filter((r) => r.monthlySavings > 0)
  .slice(0, 3)
  .map((r) => `${r.displayName}: ${r.recommendedPlan} (-$${r.monthlySavings}/mo)`)
  .join(', ')}

Return only the paragraph, no markdown, no preamble.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();

    if (!text || text.length < 50) {
      return FALLBACK_SUMMARY(result);
    }

    return text;
  } catch (error) {
    console.error('[Gemini] API error:', error);
    return FALLBACK_SUMMARY(result);
  }
};
