import {
  PRICING_DATA,
  getPlanData,
  getBenchmarkAvg,
  getTeamSizeBucket,
  ToolName,
} from '../data/pricing.data';
import { generateShareId, round2, clamp, percentileRank } from '../utils/helpers';

// ─── Input / Output Types ────────────────────────────────────────────────────

export interface ToolInput {
  toolName: string;
  plan: string;
  seats: number;
  monthlySpend: number; // user-entered actual spend
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: string;
}

export type OptimizationType =
  | 'plan-downgrade'
  | 'overlap-reduction'
  | 'overpaying'
  | 'optimized'
  | 'api-switch';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ToolRecommendation {
  toolName: string;
  displayName: string;
  currentPlan: string;
  currentSeats: number;
  currentMonthlySpend: number;
  calculatedMarketRate: number;
  recommendedPlan: string;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  optimizationConfidence: ConfidenceLevel;
  type: OptimizationType;
}

export interface BenchmarkComparison {
  userSpendPerPerson: number;
  industryAveragePerPerson: number;
  percentileRank: number;
  teamSizeBucket: string;
  useCase: string;
  overspendPercentage: number;
}

export interface AuditResult {
  shareId: string;
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  wastePercentage: number;
  optimizationScore: number;
  benchmarkPercentile: number;
  biggestInefficiency: string;
  recommendations: ToolRecommendation[];
  benchmarkData: BenchmarkComparison;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getDisplayName = (toolName: string): string => {
  return PRICING_DATA[toolName as ToolName]?.displayName ?? toolName;
};

/**
 * Calculate the market rate for a tool entry based on official pricing.
 */
const calcMarketRate = (tool: ToolInput): number => {
  const planData = getPlanData(tool.toolName as ToolName, tool.plan);
  if (!planData) return tool.monthlySpend; // unknown plan — trust user
  if (planData.billingType === 'usage') return tool.monthlySpend; // API usage is self-reported
  if (planData.billingType === 'per-seat') return round2(planData.monthlyPrice * tool.seats);
  return planData.monthlyPrice; // individual
};

// ─── Audit Rules ─────────────────────────────────────────────────────────────

/**
 * Rule: If a user is on a per-seat Team plan with ≤2 seats,
 * individual plans are almost always cheaper.
 */
const ruleTeamPlanSmallSeat = (tool: ToolInput): ToolRecommendation | null => {
  const marketRate = calcMarketRate(tool);

  // ChatGPT Team (≤2 seats) → ChatGPT Plus × seats
  if (tool.toolName === 'chatgpt' && tool.plan === 'team' && tool.seats <= 2) {
    const recommended = 20 * tool.seats;
    const savings = round2(marketRate - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'ChatGPT',
      currentPlan: 'Team',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Plus × ${tool.seats} individuals`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `ChatGPT Team costs $30/seat/month. With only ${tool.seats} seat${tool.seats > 1 ? 's' : ''}, switching each user to ChatGPT Plus ($20/month) saves $${savings}/month with identical access for most workflows.`,
      optimizationConfidence: 'high',
      type: 'plan-downgrade',
    };
  }

  // Claude Team Standard (≤2 seats) → Claude Pro × seats
  if (tool.toolName === 'claude' && tool.plan === 'team-standard' && tool.seats <= 2) {
    const recommended = 20 * tool.seats;
    const savings = round2(marketRate - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'Claude',
      currentPlan: 'Team (Standard)',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Pro × ${tool.seats} individuals`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `Claude Team Standard at $25/seat/month is designed for 5+ users. For ${tool.seats} user${tool.seats > 1 ? 's' : ''}, Claude Pro at $20/month each offers equivalent capabilities at a lower total cost.`,
      optimizationConfidence: 'high',
      type: 'plan-downgrade',
    };
  }

  // GitHub Copilot Pro+ for ≤3 users → Business plan is cheaper
  if (tool.toolName === 'copilot' && tool.plan === 'pro-plus' && tool.seats <= 5) {
    const recommended = 19 * tool.seats;
    const savings = round2(marketRate - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'GitHub Copilot',
      currentPlan: 'Pro+',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Business (${tool.seats} seats)`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `GitHub Copilot Pro+ at $39/user/month significantly exceeds Business at $19/user/month. For a team of ${tool.seats}, the Business plan provides core coding assistance at a 51% lower cost.`,
      optimizationConfidence: 'high',
      type: 'plan-downgrade',
    };
  }

  // Windsurf Teams for ≤2 users → individual Pro × seats
  if (tool.toolName === 'windsurf' && tool.plan === 'teams' && tool.seats <= 2) {
    const recommended = 20 * tool.seats;
    const savings = round2(marketRate - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'Windsurf',
      currentPlan: 'Teams',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Pro × ${tool.seats} individuals`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `Windsurf Teams at $40/seat/month is overkill for ${tool.seats} user${tool.seats > 1 ? 's' : ''}. The Pro plan at $20/month provides full frontier model access at half the price.`,
      optimizationConfidence: 'high',
      type: 'plan-downgrade',
    };
  }

  // Cursor Pro+ for ≤2 users → consider Cursor Pro
  if (tool.toolName === 'cursor' && tool.plan === 'pro-plus' && tool.seats <= 2) {
    const recommended = 20 * tool.seats;
    const savings = round2(tool.monthlySpend - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'Cursor',
      currentPlan: 'Pro+',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Pro × ${tool.seats}`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `Cursor Pro+ at $60/month provides 3× usage vs Pro. For ${tool.seats} developer${tool.seats > 1 ? 's' : ''} not hitting Pro limits, switching to Pro at $20/month saves $${savings}/month without impacting daily workflow.`,
      optimizationConfidence: 'medium',
      type: 'plan-downgrade',
    };
  }

  // Cursor Ultra → Pro+ for ≤3 users
  if (tool.toolName === 'cursor' && tool.plan === 'ultra' && tool.seats <= 3) {
    const recommended = 60 * tool.seats;
    const savings = round2(tool.monthlySpend - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'Cursor',
      currentPlan: 'Ultra',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `Pro+ × ${tool.seats}`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `Cursor Ultra at $200/month offers 20× usage, typically justified for power users processing massive codebases. For ${tool.seats} user${tool.seats > 1 ? 's' : ''}, Pro+ at $60/month (3× usage) is likely sufficient and saves $${savings}/month.`,
      optimizationConfidence: 'medium',
      type: 'plan-downgrade',
    };
  }

  // Gemini Ultra for individuals → Gemini Pro is likely enough
  if (tool.toolName === 'gemini' && tool.plan === 'ai-ultra') {
    const recommended = 19.99 * tool.seats;
    const savings = round2(tool.monthlySpend - recommended);
    if (savings <= 0) return null;
    return {
      toolName: tool.toolName,
      displayName: 'Google Gemini',
      currentPlan: 'AI Ultra',
      currentSeats: tool.seats,
      currentMonthlySpend: tool.monthlySpend,
      calculatedMarketRate: marketRate,
      recommendedPlan: `AI Pro × ${tool.seats}`,
      recommendedMonthlySpend: recommended,
      monthlySavings: savings,
      annualSavings: round2(savings * 12),
      reasoning: `Gemini AI Ultra at $249.99/month is designed for users requiring Deep Think, Veo 3.1 video generation, and Gemini Agent (US-only). For standard productivity, AI Pro at $19.99/month covers 95% of use cases at a fraction of the cost.`,
      optimizationConfidence: 'high',
      type: 'plan-downgrade',
    };
  }

  return null;
};

/**
 * Rule: Detect if user is paying significantly more than the market rate.
 */
const ruleOverpaying = (tool: ToolInput): ToolRecommendation | null => {
  const planData = getPlanData(tool.toolName as ToolName, tool.plan);
  if (!planData || planData.billingType === 'usage') return null;

  const marketRate = calcMarketRate(tool);
  if (marketRate === 0) return null;

  const overpayAmount = round2(tool.monthlySpend - marketRate);
  const overpayPct = (overpayAmount / marketRate) * 100;

  // Only flag if overpaying by more than 15%
  if (overpayPct < 15 || overpayAmount < 5) return null;

  return {
    toolName: tool.toolName,
    displayName: getDisplayName(tool.toolName),
    currentPlan: planData.label,
    currentSeats: tool.seats,
    currentMonthlySpend: tool.monthlySpend,
    calculatedMarketRate: marketRate,
    recommendedPlan: `${planData.label} (at market rate)`,
    recommendedMonthlySpend: marketRate,
    monthlySavings: overpayAmount,
    annualSavings: round2(overpayAmount * 12),
    reasoning: `Your entered spend of $${tool.monthlySpend}/month for ${planData.label} is ${Math.round(overpayPct)}% above the official rate of $${marketRate}/month. Review your billing for unused seats, add-ons, or incorrect plan tier.`,
    optimizationConfidence: 'high',
    type: 'overpaying',
  };
};

/**
 * Rule: Detect Cursor + GitHub Copilot overlap.
 * Both are AI coding assistants — having both is redundant.
 */
const ruleOverlapCursorCopilot = (
  tools: ToolInput[]
): ToolRecommendation | null => {
  const cursor = tools.find((t) => t.toolName === 'cursor');
  const copilot = tools.find((t) => t.toolName === 'copilot');
  if (!cursor || !copilot) return null;
  if (cursor.plan === 'hobby' && copilot.plan === 'free') return null;

  // Recommend keeping whichever is cheaper / more appropriate
  const cursorCost = cursor.monthlySpend;
  const copilotCost = copilot.monthlySpend;
  const keepTool = cursorCost <= copilotCost ? 'Cursor' : 'GitHub Copilot';
  const dropTool = keepTool === 'Cursor' ? 'GitHub Copilot' : 'Cursor';
  const savings = round2(Math.min(cursorCost, copilotCost));

  return {
    toolName: copilotCost > cursorCost ? 'copilot' : 'cursor',
    displayName: dropTool,
    currentPlan: 'Active subscription',
    currentSeats: copilotCost > cursorCost ? copilot.seats : cursor.seats,
    currentMonthlySpend: savings,
    calculatedMarketRate: savings,
    recommendedPlan: 'Cancel — consolidate with ' + keepTool,
    recommendedMonthlySpend: 0,
    monthlySavings: savings,
    annualSavings: round2(savings * 12),
    reasoning: `Cursor and GitHub Copilot both provide AI-powered code completion and chat. Running both creates a ${Math.round((savings / (cursorCost + copilotCost)) * 100)}% budget overlap. ${keepTool} is the stronger choice for your stack — cancelling ${dropTool} recovers $${savings}/month with no capability loss.`,
    optimizationConfidence: 'high',
    type: 'overlap-reduction',
  };
};

/**
 * Rule: Detect Cursor + Windsurf overlap.
 * Both are full AI IDEs — having both is highly redundant.
 */
const ruleOverlapCursorWindsurf = (
  tools: ToolInput[]
): ToolRecommendation | null => {
  const cursor = tools.find((t) => t.toolName === 'cursor');
  const windsurf = tools.find((t) => t.toolName === 'windsurf');
  if (!cursor || !windsurf) return null;
  if (cursor.plan === 'hobby' && windsurf.plan === 'free') return null;

  const savings = round2(Math.min(cursor.monthlySpend, windsurf.monthlySpend));
  const drop = cursor.monthlySpend <= windsurf.monthlySpend ? 'Windsurf' : 'Cursor';
  const keep = drop === 'Cursor' ? 'Windsurf' : 'Cursor';

  return {
    toolName: drop.toLowerCase() as ToolName,
    displayName: drop,
    currentPlan: 'Active subscription',
    currentSeats: 1,
    currentMonthlySpend: savings,
    calculatedMarketRate: savings,
    recommendedPlan: `Cancel — consolidate with ${keep}`,
    recommendedMonthlySpend: 0,
    monthlySavings: savings,
    annualSavings: round2(savings * 12),
    reasoning: `Cursor and Windsurf are direct competitors — both are AI-first code editors with frontier model access. Operating both simultaneously wastes $${savings}/month. Pick ${keep} as your primary IDE and cancel ${drop}.`,
    optimizationConfidence: 'high',
    type: 'overlap-reduction',
  };
};

/**
 * Rule: Detect Claude + ChatGPT Team plan overlap.
 * Paying for team subscriptions on both general-AI tools is rarely justified.
 */
const ruleOverlapClaudeChatGPT = (
  tools: ToolInput[]
): ToolRecommendation | null => {
  const claude = tools.find(
    (t) => t.toolName === 'claude' && ['team-standard', 'team-premium'].includes(t.plan)
  );
  const chatgpt = tools.find(
    (t) => t.toolName === 'chatgpt' && t.plan === 'team'
  );
  if (!claude || !chatgpt) return null;

  const savings = round2(Math.min(claude.monthlySpend, chatgpt.monthlySpend));
  const drop = claude.monthlySpend <= chatgpt.monthlySpend ? 'Claude' : 'ChatGPT';
  const keep = drop === 'Claude' ? 'ChatGPT' : 'Claude';

  return {
    toolName: drop.toLowerCase() as ToolName,
    displayName: drop,
    currentPlan: 'Team',
    currentSeats: drop === 'Claude' ? claude.seats : chatgpt.seats,
    currentMonthlySpend: savings,
    calculatedMarketRate: savings,
    recommendedPlan: `Consolidate with ${keep} Team`,
    recommendedMonthlySpend: 0,
    monthlySavings: savings,
    annualSavings: round2(savings * 12),
    reasoning: `Running Claude Team and ChatGPT Team simultaneously creates significant budget overlap. Both tools cover general-purpose AI assistance, writing, and research. Consolidating onto ${keep} recovers $${savings}/month — reserve the other for occasional use via free tiers.`,
    optimizationConfidence: 'high',
    type: 'overlap-reduction',
  };
};

/**
 * Rule: Windsurf + GitHub Copilot overlap.
 */
const ruleOverlapWindsurfCopilot = (
  tools: ToolInput[]
): ToolRecommendation | null => {
  const windsurf = tools.find((t) => t.toolName === 'windsurf' && t.plan !== 'free');
  const copilot = tools.find((t) => t.toolName === 'copilot' && t.plan !== 'free');
  if (!windsurf || !copilot) return null;

  const savings = round2(Math.min(windsurf.monthlySpend, copilot.monthlySpend));
  const drop = windsurf.monthlySpend <= copilot.monthlySpend ? 'Windsurf' : 'GitHub Copilot';
  const keep = drop === 'Windsurf' ? 'GitHub Copilot' : 'Windsurf';

  return {
    toolName: drop === 'Windsurf' ? 'windsurf' : 'copilot',
    displayName: drop,
    currentPlan: 'Active subscription',
    currentSeats: drop === 'Windsurf' ? windsurf.seats : copilot.seats,
    currentMonthlySpend: savings,
    calculatedMarketRate: savings,
    recommendedPlan: `Cancel — use ${keep} only`,
    recommendedMonthlySpend: 0,
    monthlySavings: savings,
    annualSavings: round2(savings * 12),
    reasoning: `Both Windsurf and GitHub Copilot provide inline code completion and AI chat. Your team doesn't need both. ${keep} covers the same workflow — cancelling ${drop} eliminates $${savings}/month in duplicate spend.`,
    optimizationConfidence: 'medium',
    type: 'overlap-reduction',
  };
};

// ─── Optimization Score ───────────────────────────────────────────────────────

const calcOptimizationScore = (
  totalMonthlySpend: number,
  totalMonthlySavings: number,
  redundancyCount: number
): number => {
  if (totalMonthlySpend === 0) return 100;
  const wasteRatio = totalMonthlySavings / totalMonthlySpend;
  const base = Math.round(100 - wasteRatio * 80 - redundancyCount * 5);
  return clamp(base, 10, 100);
};

// ─── Main Audit Function ──────────────────────────────────────────────────────

export const runAudit = (input: AuditInput): AuditResult => {
  const { tools, teamSize, primaryUseCase } = input;
  const shareId = generateShareId();

  // 1. Collect per-tool recommendations
  const perToolRecs: ToolRecommendation[] = [];

  for (const tool of tools) {
    // Check plan-level optimization first
    const planRec = ruleTeamPlanSmallSeat(tool);
    if (planRec) {
      perToolRecs.push(planRec);
      continue; // skip overpaying check if we already have a better recommendation
    }
    // Check overpaying vs market rate
    const overRec = ruleOverpaying(tool);
    if (overRec) perToolRecs.push(overRec);
  }

  // 2. Overlap / redundancy rules
  const overlapRecs: ToolRecommendation[] = [];
  const cursorCopilot = ruleOverlapCursorCopilot(tools);
  if (cursorCopilot) overlapRecs.push(cursorCopilot);

  const cursorWindsurf = ruleOverlapCursorWindsurf(tools);
  if (cursorWindsurf) overlapRecs.push(cursorWindsurf);

  const claudeChatGPT = ruleOverlapClaudeChatGPT(tools);
  if (claudeChatGPT) overlapRecs.push(claudeChatGPT);

  const windsurfCopilot = ruleOverlapWindsurfCopilot(tools);
  // Only add windsurf/copilot overlap if cursor overlap not already flagged
  if (windsurfCopilot && !cursorWindsurf && !cursorCopilot) {
    overlapRecs.push(windsurfCopilot);
  }

  const allRecs = [...overlapRecs, ...perToolRecs];
  const redundancyCount = overlapRecs.length;

  // 3. Deduplicate recs (same toolName shouldn't appear twice)
  const seen = new Set<string>();
  const recommendations = allRecs.filter((r) => {
    if (seen.has(r.toolName)) return false;
    seen.add(r.toolName);
    return true;
  });

  // For tools with no issues, add "optimized" entries
  for (const tool of tools) {
    if (!recommendations.find((r) => r.toolName === tool.toolName)) {
      const planData = getPlanData(tool.toolName as ToolName, tool.plan);
      recommendations.push({
        toolName: tool.toolName,
        displayName: getDisplayName(tool.toolName),
        currentPlan: planData?.label ?? tool.plan,
        currentSeats: tool.seats,
        currentMonthlySpend: tool.monthlySpend,
        calculatedMarketRate: calcMarketRate(tool),
        recommendedPlan: planData?.label ?? tool.plan,
        recommendedMonthlySpend: tool.monthlySpend,
        monthlySavings: 0,
        annualSavings: 0,
        reasoning: 'This tool appears well-optimized for your current setup.',
        optimizationConfidence: 'high',
        type: 'optimized',
      });
    }
  }

  // 4. Financials
  const totalMonthlySpend = round2(tools.reduce((s, t) => s + t.monthlySpend, 0));
  const totalMonthlySavings = round2(
    recommendations.reduce((s, r) => s + r.monthlySavings, 0)
  );
  const totalAnnualSavings = round2(totalMonthlySavings * 12);
  const wastePercentage =
    totalMonthlySpend > 0
      ? round2((totalMonthlySavings / totalMonthlySpend) * 100)
      : 0;

  // 5. Score
  const optimizationScore = calcOptimizationScore(
    totalMonthlySpend,
    totalMonthlySavings,
    redundancyCount
  );

  // 6. Benchmark
  const benchmarkAvg = getBenchmarkAvg(teamSize, primaryUseCase);
  const userSpendPerPerson = teamSize > 0 ? round2(totalMonthlySpend / teamSize) : 0;
  const overspendPercentage = round2(
    ((userSpendPerPerson - benchmarkAvg) / benchmarkAvg) * 100
  );
  const benchmarkPercentile = percentileRank(userSpendPerPerson, benchmarkAvg);

  const benchmarkData: import('../data/pricing.data').ToolName extends never
    ? never
    : {
        userSpendPerPerson: number;
        industryAveragePerPerson: number;
        percentileRank: number;
        teamSizeBucket: string;
        useCase: string;
        overspendPercentage: number;
      } = {
    userSpendPerPerson,
    industryAveragePerPerson: benchmarkAvg,
    percentileRank: benchmarkPercentile,
    teamSizeBucket: getTeamSizeBucket(teamSize),
    useCase: primaryUseCase,
    overspendPercentage,
  };

  // 7. Biggest inefficiency
  const sortedRecs = [...recommendations]
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.annualSavings - a.annualSavings);

  const topRec = sortedRecs[0];
  const biggestInefficiency = topRec
    ? `${topRec.displayName} — ${topRec.recommendedPlan} could save $${topRec.annualSavings.toLocaleString()}/year`
    : 'No major inefficiencies detected. Your AI stack appears well-optimized.';

  return {
    shareId,
    tools,
    teamSize,
    primaryUseCase,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    wastePercentage,
    optimizationScore,
    benchmarkPercentile,
    biggestInefficiency,
    recommendations,
    benchmarkData,
  };
};
