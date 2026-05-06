import { describe, it, expect } from 'vitest';
import { runAudit } from '../services/audit.service';

// ─── Test 1: Detects ChatGPT Team overspending (small seats) ─────────────────
describe('Audit Engine', () => {
  it('detects ChatGPT Team plan overspending for ≤2 seats', () => {
    const result = runAudit({
      tools: [{ toolName: 'chatgpt', plan: 'team', seats: 2, monthlySpend: 60 }],
      teamSize: 2,
      primaryUseCase: 'writing',
    });

    const rec = result.recommendations.find(
      (r) => r.toolName === 'chatgpt' && r.type === 'plan-downgrade'
    );
    expect(rec).toBeDefined();
    expect(rec!.monthlySavings).toBeGreaterThan(0);
    expect(rec!.annualSavings).toBe(rec!.monthlySavings * 12);
  });

  // ─── Test 2: Calculates total savings correctly ───────────────────────────
  it('calculates total monthly and annual savings correctly', () => {
    const result = runAudit({
      tools: [
        { toolName: 'chatgpt', plan: 'team', seats: 2, monthlySpend: 60 },
        { toolName: 'claude', plan: 'team-standard', seats: 2, monthlySpend: 50 },
      ],
      teamSize: 2,
      primaryUseCase: 'writing',
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBeCloseTo(result.totalMonthlySavings * 12, 1);
    expect(result.totalMonthlySpend).toBe(110);
  });

  // ─── Test 3: Detects Cursor + Copilot overlap ─────────────────────────────
  it('detects Cursor and GitHub Copilot overlap', () => {
    const result = runAudit({
      tools: [
        { toolName: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 },
        { toolName: 'copilot', plan: 'business', seats: 3, monthlySpend: 57 },
      ],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    const overlapRec = result.recommendations.find((r) => r.type === 'overlap-reduction');
    expect(overlapRec).toBeDefined();
    expect(overlapRec!.monthlySavings).toBeGreaterThan(0);
  });

  // ─── Test 4: Detects Claude + ChatGPT Team overlap ───────────────────────
  it('detects Claude Team and ChatGPT Team overlap', () => {
    const result = runAudit({
      tools: [
        { toolName: 'claude', plan: 'team-standard', seats: 5, monthlySpend: 125 },
        { toolName: 'chatgpt', plan: 'team', seats: 5, monthlySpend: 150 },
      ],
      teamSize: 5,
      primaryUseCase: 'writing',
    });

    const overlapRec = result.recommendations.find((r) => r.type === 'overlap-reduction');
    expect(overlapRec).toBeDefined();
    expect(overlapRec!.annualSavings).toBeGreaterThan(0);
  });

  // ─── Test 5: Generates benchmark data correctly ───────────────────────────
  it('generates benchmark data for small coding team', () => {
    const result = runAudit({
      tools: [{ toolName: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 }],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    expect(result.benchmarkData).toBeDefined();
    expect(result.benchmarkData.teamSizeBucket).toBe('small');
    expect(result.benchmarkData.industryAveragePerPerson).toBe(80);
    expect(result.benchmarkPercentile).toBeGreaterThan(0);
    expect(result.benchmarkPercentile).toBeLessThanOrEqual(100);
  });

  // ─── Test 6: Optimization score in valid range ────────────────────────────
  it('generates optimization score between 10 and 100', () => {
    const result = runAudit({
      tools: [
        { toolName: 'cursor', plan: 'ultra', seats: 1, monthlySpend: 200 },
        { toolName: 'copilot', plan: 'business', seats: 5, monthlySpend: 95 },
        { toolName: 'windsurf', plan: 'pro', seats: 1, monthlySpend: 20 },
        { toolName: 'chatgpt', plan: 'team', seats: 2, monthlySpend: 60 },
        { toolName: 'claude', plan: 'team-standard', seats: 2, monthlySpend: 50 },
      ],
      teamSize: 5,
      primaryUseCase: 'coding',
    });

    expect(result.optimizationScore).toBeGreaterThanOrEqual(10);
    expect(result.optimizationScore).toBeLessThanOrEqual(100);
  });

  // ─── Test 7: Optimized stack returns high score ───────────────────────────
  it('returns high score for an already optimized stack', () => {
    const result = runAudit({
      tools: [{ toolName: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    });

    expect(result.optimizationScore).toBeGreaterThanOrEqual(85);
    expect(result.totalMonthlySavings).toBe(0);
  });

  // ─── Test 8: Share ID is generated and unique ─────────────────────────────
  it('generates a unique shareId for each audit', () => {
    const result1 = runAudit({
      tools: [{ toolName: 'chatgpt', plan: 'plus', seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      primaryUseCase: 'writing',
    });
    const result2 = runAudit({
      tools: [{ toolName: 'chatgpt', plan: 'plus', seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      primaryUseCase: 'writing',
    });

    expect(result1.shareId).toBeDefined();
    expect(result1.shareId).toHaveLength(8);
    expect(result1.shareId).not.toBe(result2.shareId);
  });

  // ─── Test 9: Detects overpaying vs market rate ────────────────────────────
  it('detects when user is overpaying versus official market rate', () => {
    const result = runAudit({
      tools: [
        // User entered $150 but ChatGPT Plus is $20 — clearly overpaying (or wrong plan)
        { toolName: 'chatgpt', plan: 'plus', seats: 1, monthlySpend: 150 },
      ],
      teamSize: 1,
      primaryUseCase: 'writing',
    });

    const overRec = result.recommendations.find((r) => r.type === 'overpaying');
    expect(overRec).toBeDefined();
    expect(overRec!.monthlySavings).toBeGreaterThan(0);
  });
});
