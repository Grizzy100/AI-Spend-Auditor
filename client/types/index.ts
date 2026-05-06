// ─── Shared domain types (client-side) ────────────────────────────────────────

export type ToolName =
  | 'chatgpt'
  | 'claude'
  | 'cursor'
  | 'copilot'
  | 'gemini'
  | 'windsurf'
  | 'openai-api'
  | 'anthropic-api';

export type UseCase = 'coding' | 'writing' | 'research' | 'data-analysis' | 'mixed';

export interface ToolEntry {
  id: string;          // local UUID for list key
  toolName: ToolName;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditFormState {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: UseCase;
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

export interface BenchmarkData {
  userSpendPerPerson: number;
  industryAveragePerPerson: number;
  percentileRank: number;
  teamSizeBucket: string;
  useCase: string;
  overspendPercentage: number;
}

export interface AuditReport {
  id: string;
  shareId: string;
  createdAt: string;
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  wastePercentage: number;
  optimizationScore: number;
  benchmarkPercentile: number;
  biggestInefficiency: string;
  aiSummary: string;
  recommendations: ToolRecommendation[];
  benchmarkData: BenchmarkData;
}

export interface CreateAuditResponse {
  success: boolean;
  shareId: string;
  reportId: string;
}

export interface GetReportResponse {
  success: boolean;
  report: AuditReport;
}

export interface LeadPayload {
  email: string;
  companyName?: string;
  role?: string;
  shareId: string;
}
