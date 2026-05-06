/**
 * PRICING_DATA.ts
 * Verified pricing data from official websites — May 2026
 * All prices in USD.
 */

export type ToolName =
  | 'chatgpt'
  | 'claude'
  | 'cursor'
  | 'copilot'
  | 'gemini'
  | 'windsurf'
  | 'openai-api'
  | 'anthropic-api';

export type BillingType = 'individual' | 'per-seat' | 'usage';

export interface PlanData {
  id: string;
  label: string;
  monthlyPrice: number;        // per seat or individual
  billingType: BillingType;
  minSeats?: number;
  maxSeats?: number;
  isEnterprise?: boolean;
}

export interface ToolPricing {
  toolName: ToolName;
  displayName: string;
  category: 'coding' | 'general-ai' | 'api';
  plans: PlanData[];
}

export const PRICING_DATA: Record<ToolName, ToolPricing> = {
  chatgpt: {
    toolName: 'chatgpt',
    displayName: 'ChatGPT',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0, billingType: 'individual' },
      { id: 'plus', label: 'Plus', monthlyPrice: 20, billingType: 'individual' },
      { id: 'pro', label: 'Pro', monthlyPrice: 200, billingType: 'individual' },
      { id: 'team', label: 'Team', monthlyPrice: 30, billingType: 'per-seat', minSeats: 2 },
      { id: 'enterprise', label: 'Enterprise', monthlyPrice: 0, billingType: 'per-seat', isEnterprise: true },
    ],
  },

  claude: {
    toolName: 'claude',
    displayName: 'Claude',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0, billingType: 'individual' },
      { id: 'pro', label: 'Pro', monthlyPrice: 20, billingType: 'individual' },
      { id: 'max', label: 'Max', monthlyPrice: 100, billingType: 'individual' },
      { id: 'team-standard', label: 'Team (Standard)', monthlyPrice: 25, billingType: 'per-seat', minSeats: 5 },
      { id: 'team-premium', label: 'Team (Premium)', monthlyPrice: 125, billingType: 'per-seat', minSeats: 5 },
      { id: 'enterprise', label: 'Enterprise', monthlyPrice: 20, billingType: 'per-seat', isEnterprise: true },
    ],
  },

  cursor: {
    toolName: 'cursor',
    displayName: 'Cursor',
    category: 'coding',
    plans: [
      { id: 'hobby', label: 'Hobby', monthlyPrice: 0, billingType: 'individual' },
      { id: 'pro', label: 'Pro', monthlyPrice: 20, billingType: 'individual' },
      { id: 'pro-plus', label: 'Pro+', monthlyPrice: 60, billingType: 'individual' },
      { id: 'ultra', label: 'Ultra', monthlyPrice: 200, billingType: 'individual' },
    ],
  },

  copilot: {
    toolName: 'copilot',
    displayName: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0, billingType: 'individual' },
      { id: 'pro', label: 'Pro', monthlyPrice: 10, billingType: 'per-seat' },
      { id: 'pro-plus', label: 'Pro+', monthlyPrice: 39, billingType: 'per-seat' },
      { id: 'business', label: 'Business', monthlyPrice: 19, billingType: 'per-seat' },
      { id: 'enterprise', label: 'Enterprise', monthlyPrice: 39, billingType: 'per-seat', isEnterprise: true },
    ],
  },

  gemini: {
    toolName: 'gemini',
    displayName: 'Google Gemini',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0, billingType: 'individual' },
      { id: 'ai-plus', label: 'AI Plus', monthlyPrice: 7.99, billingType: 'individual' },
      { id: 'ai-pro', label: 'AI Pro', monthlyPrice: 19.99, billingType: 'individual' },
      { id: 'ai-ultra', label: 'AI Ultra', monthlyPrice: 249.99, billingType: 'individual' },
    ],
  },

  windsurf: {
    toolName: 'windsurf',
    displayName: 'Windsurf',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0, billingType: 'individual' },
      { id: 'pro', label: 'Pro', monthlyPrice: 20, billingType: 'individual' },
      { id: 'max', label: 'Max', monthlyPrice: 200, billingType: 'individual' },
      { id: 'teams', label: 'Teams', monthlyPrice: 40, billingType: 'per-seat' },
      { id: 'enterprise', label: 'Enterprise', monthlyPrice: 0, billingType: 'per-seat', isEnterprise: true },
    ],
  },

  'openai-api': {
    toolName: 'openai-api',
    displayName: 'OpenAI API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay-as-you-go', monthlyPrice: 0, billingType: 'usage' },
    ],
  },

  'anthropic-api': {
    toolName: 'anthropic-api',
    displayName: 'Anthropic API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay-as-you-go', monthlyPrice: 0, billingType: 'usage' },
    ],
  },
};

/**
 * Get the monthly price for a specific tool+plan combination.
 * Returns 0 for unknown plans or usage-based APIs.
 */
export const getPlanPrice = (toolName: ToolName, planId: string): number => {
  const tool = PRICING_DATA[toolName];
  if (!tool) return 0;
  const plan = tool.plans.find((p) => p.id === planId);
  return plan?.monthlyPrice ?? 0;
};

/**
 * Get the plan data for a specific tool+plan combination.
 */
export const getPlanData = (toolName: ToolName, planId: string): PlanData | undefined => {
  const tool = PRICING_DATA[toolName];
  if (!tool) return undefined;
  return tool.plans.find((p) => p.id === planId);
};

/**
 * Industry benchmark spend per person per month (in USD).
 * Based on team size buckets and primary use case.
 */
export const BENCHMARKS: Record<string, Record<string, number>> = {
  'small': {        // 1-5 people
    coding: 80,
    writing: 35,
    research: 40,
    'data-analysis': 45,
    mixed: 57,
  },
  'medium': {       // 6-15 people
    coding: 70,
    writing: 30,
    research: 35,
    'data-analysis': 40,
    mixed: 52,
  },
  'large': {        // 16-50 people
    coding: 60,
    writing: 25,
    research: 30,
    'data-analysis': 35,
    mixed: 45,
  },
  'enterprise': {   // 50+ people
    coding: 50,
    writing: 20,
    research: 25,
    'data-analysis': 30,
    mixed: 38,
  },
};

export const getTeamSizeBucket = (teamSize: number): string => {
  if (teamSize <= 5) return 'small';
  if (teamSize <= 15) return 'medium';
  if (teamSize <= 50) return 'large';
  return 'enterprise';
};

export const getBenchmarkAvg = (teamSize: number, useCase: string): number => {
  const bucket = getTeamSizeBucket(teamSize);
  return BENCHMARKS[bucket]?.[useCase] ?? BENCHMARKS[bucket]?.mixed ?? 55;
};
