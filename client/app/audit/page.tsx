'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TOOL_LIST, USE_CASES, formatCurrency } from '@/lib/pricing';
import { api } from '@/lib/api';
import type { ToolEntry, AuditFormState, UseCase } from '@/types';

const STORAGE_KEY = 'ai-audit-form-v1';

const makeEntry = (): ToolEntry => ({
  id: crypto.randomUUID(),
  toolName: 'chatgpt',
  plan: 'plus',
  seats: 1,
  monthlySpend: 20,
});

const DEFAULT_STATE: AuditFormState = {
  tools: [makeEntry()],
  teamSize: 5,
  primaryUseCase: 'coding',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToolRow({
  entry,
  index,
  total,
  onUpdate,
  onRemove,
}: {
  entry: ToolEntry;
  index: number;
  total: number;
  onUpdate: (id: string, updates: Partial<ToolEntry>) => void;
  onRemove: (id: string) => void;
}) {
  const toolMeta = TOOL_LIST.find((t) => t.name === entry.toolName);
  const plans = toolMeta?.plans ?? [];
  const currentPlan = plans.find((p) => p.id === entry.plan);
  const expectedMonthly = currentPlan
    ? currentPlan.billingType === 'per-seat'
      ? currentPlan.monthlyPrice * entry.seats
      : currentPlan.monthlyPrice
    : null;

  const isOverpaying =
    expectedMonthly !== null &&
    expectedMonthly > 0 &&
    entry.monthlySpend > expectedMonthly * 1.15;

  return (
    <div
      role="group"
      aria-label={`Tool ${index + 1}: ${toolMeta?.displayName ?? ''}`}
      className="p-5 rounded-xl"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isOverpaying ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        transition: 'border-color 0.2s',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Tool {index + 1}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            aria-label={`Remove tool ${index + 1}`}
            className="text-xs px-2 py-1 rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tool Name */}
        <div>
          <label
            htmlFor={`tool-name-${entry.id}`}
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            AI Tool
          </label>
          <select
            id={`tool-name-${entry.id}`}
            value={entry.toolName}
            onChange={(e) => {
              const newToolName = e.target.value as ToolName;
              const newTool = TOOL_LIST.find((t) => t.name === newToolName);
              const updates: Partial<ToolEntry> = { toolName: newToolName };
              
              if (newTool?.plans[0]) {
                const defaultPlan = newTool.plans[0];
                updates.plan = defaultPlan.id;
                updates.monthlySpend = defaultPlan.billingType === 'per-seat'
                  ? defaultPlan.monthlyPrice * entry.seats
                  : defaultPlan.monthlyPrice;
              }
              onUpdate(entry.id, updates);
            }}
            className="input-base w-full px-3 py-2 text-sm appearance-none cursor-pointer"
          >
            {TOOL_LIST.map((t) => (
              <option key={t.name} value={t.name}>
                {t.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label
            htmlFor={`tool-plan-${entry.id}`}
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Plan
          </label>
          <select
            id={`tool-plan-${entry.id}`}
            value={entry.plan}
            onChange={(e) => {
              const newPlanId = e.target.value;
              const plan = plans.find((p) => p.id === newPlanId);
              const updates: Partial<ToolEntry> = { plan: newPlanId };
              
              if (plan && plan.monthlyPrice > 0) {
                updates.monthlySpend = plan.billingType === 'per-seat'
                  ? plan.monthlyPrice * entry.seats
                  : plan.monthlyPrice;
              }
              onUpdate(entry.id, updates);
            }}
            className="input-base w-full px-3 py-2 text-sm appearance-none cursor-pointer"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label
            htmlFor={`tool-seats-${entry.id}`}
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Seats / Users
          </label>
          <input
            id={`tool-seats-${entry.id}`}
            type="number"
            min={1}
            max={10000}
            value={entry.seats}
            onChange={(e) => {
              const parsed = parseInt(e.target.value);
              const seats = isNaN(parsed) ? 1 : Math.min(10000, Math.max(1, parsed));
              onUpdate(entry.id, { seats });
            }}
            className="input-base w-full px-3 py-2 text-sm"
          />
        </div>

        {/* Monthly Spend */}
        <div>
          <label
            htmlFor={`tool-spend-${entry.id}`}
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Monthly Spend (USD)
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            >
              $
            </span>
            <input
              id={`tool-spend-${entry.id}`}
              type="number"
              min={0}
              step={0.01}
              value={entry.monthlySpend}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdate(entry.id, { monthlySpend: isNaN(val) ? 0 : Math.max(0, val) });
              }}
              className="input-base w-full pl-7 pr-3 py-2 text-sm"
              aria-describedby={isOverpaying ? `overpay-warning-${entry.id}` : undefined}
            />
          </div>
          {isOverpaying && (
            <p
              id={`overpay-warning-${entry.id}`}
              className="mt-1 text-xs"
              role="alert"
              style={{ color: '#f87171' }}
            >
              ⚠️ Above official rate ({formatCurrency(expectedMonthly!)})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const router = useRouter();
  const [form, setForm] = useState<AuditFormState>(DEFAULT_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted form state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuditFormState;
        if (parsed.tools?.length) {
          setTimeout(() => setForm(parsed), 0);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setTimeout(() => setHydrated(true), 0);
  }, []);

  // Persist form state on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [form, hydrated]);

  const updateTool = useCallback(
    (id: string, updates: Partial<ToolEntry>) => {
      setForm((prev) => ({
        ...prev,
        tools: prev.tools.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    },
    []
  );

  const addTool = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      tools: [...prev.tools, makeEntry()],
    }));
  }, []);

  const removeTool = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.id !== id),
    }));
  }, []);

  const totalMonthly = form.tools.reduce((s, t) => s + t.monthlySpend, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get('company_name_confirm')) {
      // Honeypot triggered, silently abort to deter bots
      return;
    }

    if (form.tools.length === 0) {
      setError('Add at least one AI tool to audit.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        tools: form.tools.map((t) => ({
          toolName: t.toolName,
          plan: t.plan,
          seats: t.seats,
          monthlySpend: t.monthlySpend,
        })),
        teamSize: form.teamSize,
        primaryUseCase: form.primaryUseCase,
      };

      const { shareId } = await api.createAudit(payload);
      // Clear persisted form after successful submit
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/report/${shareId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // Don't flash default state before localStorage loads
  if (!hydrated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--background)' }}
        aria-busy="true"
        aria-label="Loading form"
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="sticky top-0 z-40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Back to home"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            AI Spend Audit
          </h1>
          {totalMonthly > 0 && (
            <div
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              {formatCurrency(totalMonthly)}/mo
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10" id="main-content">
        <div className="mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Tell us about your AI stack
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Add every AI tool you pay for. We&apos;ll find what&apos;s worth keeping.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="AI spend audit form">
          {/* Team context */}
          <fieldset
            className="mb-8 p-6 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <legend
              className="text-sm font-semibold px-1 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Team context
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="team-size"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Team size (total people)
                </label>
                <input
                  id="team-size"
                  type="number"
                  min={1}
                  max={100000}
                  required
                  value={form.teamSize}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      teamSize: isNaN(parsed) ? 1 : Math.min(100000, Math.max(1, parsed)),
                    }));
                  }}
                  className="input-base w-full px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="use-case"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Primary use case
                </label>
                <select
                  id="use-case"
                  value={form.primaryUseCase}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      primaryUseCase: e.target.value as UseCase,
                    }))
                  }
                  className="input-base w-full px-3 py-2 text-sm appearance-none cursor-pointer"
                >
                  {USE_CASES.map((uc) => (
                    <option key={uc.id} value={uc.id}>
                      {uc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Tools */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                AI Tools ({form.tools.length})
              </h3>
              {totalMonthly > 0 && (
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Total:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(totalMonthly)}/month
                  </strong>
                </span>
              )}
            </div>

            <div className="space-y-3">
              {form.tools.map((entry, index) => (
                <ToolRow
                  key={entry.id}
                  entry={entry}
                  index={index}
                  total={form.tools.length}
                  onUpdate={updateTool}
                  onRemove={removeTool}
                />
              ))}
            </div>

            {form.tools.length < 8 && (
              <button
                type="button"
                onClick={addTool}
                className="mt-3 w-full py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  border: '1px dashed var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#6366f1';
                  el.style.color = '#a5b4fc';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'var(--border)';
                  el.style.color = 'var(--text-secondary)';
                }}
              >
                + Add another tool
              </button>
            )}
          </div>

          {/* Honeypot (anti-abuse) */}
          <input
            type="text"
            name="company_name_confirm"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
          />

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 p-4 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              {error}
            </div>
          )}

          {/* Summary + Submit */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {form.tools.length} tool{form.tools.length !== 1 ? 's' : ''} ·{' '}
                  {form.teamSize} team member{form.teamSize !== 1 ? 's' : ''}
                </p>
                {totalMonthly > 0 && (
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(totalMonthly)}
                    <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>
                      /month · {formatCurrency(totalMonthly * 12)}/year
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || form.tools.length === 0}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: submitting ? 'var(--surface-2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                boxShadow: submitting ? 'none' : '0 0 40px rgba(99,102,241,0.25)',
              }}
              aria-busy={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
                    aria-hidden="true"
                  />
                  Analyzing your AI spend...
                </span>
              ) : (
                'Run my audit →'
              )}
            </button>
            <p
              className="text-center text-xs mt-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Takes ~5 seconds · No account required
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
