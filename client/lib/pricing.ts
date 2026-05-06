// Pricing catalogue used to build the audit form dropdowns.
// Keep in sync with server/src/data/pricing.data.ts

export interface PlanOption {
  id: string;
  label: string;
  monthlyPrice: number; // USD, per seat or individual
  billingType?: 'individual' | 'per-seat' | 'usage';
}

export interface ToolMeta {
  name: string;
  displayName: string;
  category: 'coding' | 'general-ai' | 'api';
  plans: PlanOption[];
}

export const TOOLS: Record<string, ToolMeta> = {
  chatgpt: {
    name: 'chatgpt',
    displayName: 'ChatGPT',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0 },
      { id: 'plus', label: 'Plus ($20/mo)', monthlyPrice: 20 },
      { id: 'pro', label: 'Pro ($200/mo)', monthlyPrice: 200 },
      { id: 'team', label: 'Team ($30/seat)', monthlyPrice: 30 },
      { id: 'enterprise', label: 'Enterprise (custom)', monthlyPrice: 0 },
    ],
  },
  claude: {
    name: 'claude',
    displayName: 'Claude',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0 },
      { id: 'pro', label: 'Pro ($20/mo)', monthlyPrice: 20 },
      { id: 'max', label: 'Max ($100/mo)', monthlyPrice: 100 },
      { id: 'team-standard', label: 'Team Standard ($25/seat)', monthlyPrice: 25 },
      { id: 'team-premium', label: 'Team Premium ($125/seat)', monthlyPrice: 125 },
      { id: 'enterprise', label: 'Enterprise (custom)', monthlyPrice: 0 },
    ],
  },
  cursor: {
    name: 'cursor',
    displayName: 'Cursor',
    category: 'coding',
    plans: [
      { id: 'hobby', label: 'Hobby (Free)', monthlyPrice: 0 },
      { id: 'pro', label: 'Pro ($20/mo)', monthlyPrice: 20 },
      { id: 'pro-plus', label: 'Pro+ ($60/mo)', monthlyPrice: 60 },
      { id: 'ultra', label: 'Ultra ($200/mo)', monthlyPrice: 200 },
    ],
  },
  copilot: {
    name: 'copilot',
    displayName: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0 },
      { id: 'pro', label: 'Pro ($10/seat)', monthlyPrice: 10 },
      { id: 'pro-plus', label: 'Pro+ ($39/seat)', monthlyPrice: 39 },
      { id: 'business', label: 'Business ($19/seat)', monthlyPrice: 19 },
      { id: 'enterprise', label: 'Enterprise ($39/seat)', monthlyPrice: 39 },
    ],
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini',
    category: 'general-ai',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0 },
      { id: 'ai-plus', label: 'AI Plus ($7.99/mo)', monthlyPrice: 7.99 },
      { id: 'ai-pro', label: 'AI Pro ($19.99/mo)', monthlyPrice: 19.99 },
      { id: 'ai-ultra', label: 'AI Ultra ($249.99/mo)', monthlyPrice: 249.99 },
    ],
  },
  windsurf: {
    name: 'windsurf',
    displayName: 'Windsurf',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', monthlyPrice: 0 },
      { id: 'pro', label: 'Pro ($20/mo)', monthlyPrice: 20 },
      { id: 'max', label: 'Max ($200/mo)', monthlyPrice: 200 },
      { id: 'teams', label: 'Teams ($40/seat)', monthlyPrice: 40 },
      { id: 'enterprise', label: 'Enterprise (custom)', monthlyPrice: 0 },
    ],
  },
  'openai-api': {
    name: 'openai-api',
    displayName: 'OpenAI API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay-as-you-go', monthlyPrice: 0 },
    ],
  },
  'anthropic-api': {
    name: 'anthropic-api',
    displayName: 'Anthropic API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay-as-you-go', monthlyPrice: 0 },
    ],
  },
};

export const TOOL_LIST = Object.values(TOOLS);

export const USE_CASES = [
  { id: 'coding', label: '💻 Coding & Development' },
  { id: 'writing', label: '✍️ Writing & Content' },
  { id: 'research', label: '🔍 Research & Analysis' },
  { id: 'data-analysis', label: '📊 Data Analysis' },
  { id: 'mixed', label: '🔀 Mixed / General' },
] as const;

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
