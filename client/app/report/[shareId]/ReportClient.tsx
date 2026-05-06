'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/pricing';
import type { AuditReport, ToolRecommendation } from '@/types';

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/100</div>
      </div>
    </div>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({ rec, rank }: { rec: ToolRecommendation; rank: number }) {
  const isOptimized = rec.type === 'optimized';

  const isSavings = rec.monthlySavings > 0;

  const typeLabel: Record<string, string> = {
    'plan-downgrade': 'Plan Downgrade',
    'overlap-reduction': 'Overlap Detected',
    'overpaying': 'Overpaying',
    'optimized': 'Optimized ✓',
    'api-switch': 'Consider API',
  };

  const typeColor: Record<string, string> = {
    'plan-downgrade': 'rgba(99,102,241,0.15)',
    'overlap-reduction': 'rgba(239,68,68,0.12)',
    'overpaying': 'rgba(245,158,11,0.12)',
    'optimized': 'rgba(16,185,129,0.12)',
    'api-switch': 'rgba(139,92,246,0.12)',
  };

  const typeBorder: Record<string, string> = {
    'plan-downgrade': 'rgba(99,102,241,0.25)',
    'overlap-reduction': 'rgba(239,68,68,0.25)',
    'overpaying': 'rgba(245,158,11,0.25)',
    'optimized': 'rgba(16,185,129,0.15)',
    'api-switch': 'rgba(139,92,246,0.25)',
  };

  const typeText: Record<string, string> = {
    'plan-downgrade': '#818cf8',
    'overlap-reduction': '#f87171',
    'overpaying': '#fbbf24',
    'optimized': '#34d399',
    'api-switch': '#c4b5fd',
  };

  return (
    <article
      aria-label={`${rec.displayName} recommendation`}
      className="p-5 rounded-xl"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isOptimized ? 'var(--border)' : typeBorder[rec.type] ?? 'var(--border)'}`,
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span
            className="text-lg font-black opacity-30"
            style={{ color: 'var(--text-primary)', minWidth: '1.5rem' }}
            aria-hidden="true"
          >
            {String(rank).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {rec.displayName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: typeColor[rec.type] ?? 'rgba(255,255,255,0.05)',
                  color: typeText[rec.type] ?? 'var(--text-secondary)',
                  border: `1px solid ${typeBorder[rec.type] ?? 'var(--border)'}`,
                }}
              >
                {typeLabel[rec.type] ?? rec.type}
              </span>
              {rec.optimizationConfidence === 'high' && !isOptimized && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                >
                  High confidence
                </span>
              )}
            </div>
          </div>
        </div>

        {isSavings && (
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold" style={{ color: '#10b981' }}>
              -{formatCurrency(rec.monthlySavings)}/mo
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              -{formatCurrency(rec.annualSavings)}/yr
            </div>
          </div>
        )}
      </div>

      {/* Plan change */}
      {!isOptimized && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span
            className="px-2 py-1 rounded-md"
            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
          >
            {rec.currentPlan}
          </span>
          <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">→</span>
          <span
            className="px-2 py-1 rounded-md"
            style={{
              background: isSavings ? 'rgba(16,185,129,0.1)' : 'var(--surface-2)',
              color: isSavings ? '#34d399' : 'var(--text-secondary)',
              border: isSavings ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
            }}
          >
            {rec.recommendedPlan}
          </span>
        </div>
      )}

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {rec.reasoning}
      </p>
    </article>
  );
}

// ─── Email Capture ────────────────────────────────────────────────────────────

function EmailCapture({ shareId, savings }: { shareId: string; savings: number }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected
    if (!email) return;

    setStatus('submitting');
    try {
      await api.captureLead({ email, companyName: company, role, shareId });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div
        className="p-8 rounded-2xl text-center"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
        role="status"
        aria-live="polite"
      >
        <div className="text-3xl mb-3" aria-hidden="true">✓</div>
        <h3 className="font-semibold text-lg mb-1" style={{ color: '#34d399' }}>
          Report sent!
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Check your inbox for a copy of this audit with the full breakdown.
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 sm:p-8 rounded-2xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '0 0 60px rgba(99,102,241,0.08)',
      }}
    >
      <div className="mb-6">
        <div
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: '#818cf8' }}
        >
          {savings > 500
            ? '⚡ You qualify for a Credex consultation'
            : '📬 Get your report by email'}
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {savings > 500
            ? `Save $${savings.toLocaleString()}/year — let us help you implement it`
            : 'Email yourself this report'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {savings > 500
            ? 'With this level of savings identified, a 30-minute Credex review call typically uncovers 2-3× more. No commitment required.'
            : 'Get a copy of your full audit with recommendations sent directly to your inbox.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} aria-label="Email capture form">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
        />

        <div className="space-y-3">
          <div>
            <label htmlFor="lead-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Work email <span aria-label="required">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="lead-company" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Company (optional)
              </label>
              <input
                id="lead-company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input-base w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="lead-role" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Your role (optional)
              </label>
              <input
                id="lead-role"
                type="text"
                autoComplete="organization-title"
                placeholder="CTO, Founder..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-base w-full px-4 py-3 text-sm"
              />
            </div>
          </div>

          {status === 'error' && (
            <p className="text-sm" role="alert" style={{ color: '#f87171' }}>
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || !email}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
            }}
            aria-busy={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : savings > 500 ? 'Book a free review call →' : 'Send my report →'}
          </button>
        </div>
        <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}

// ─── Main Report Client ───────────────────────────────────────────────────────

export default function ReportClient({
  report,
  shareId,
}: {
  report: AuditReport;
  shareId: string;
}) {
  const [copied, setCopied] = useState(false);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const shareUrl = `${APP_URL}/report/${shareId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const isWellOptimized = report.totalMonthlySavings < 100;
  const qualifiesForConsult = report.totalAnnualSavings > 500;
  const savingsRecs = report.recommendations.filter((r) => r.monthlySavings > 0);

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">New audit</span>
          </Link>
          <div className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              aria-hidden="true"
            >A</div>
            AI Spend Audit
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
            style={{
              background: copied ? 'rgba(16,185,129,0.1)' : 'var(--surface)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              color: copied ? '#34d399' : 'var(--text-secondary)',
            }}
            aria-label="Copy shareable link"
          >
            {copied ? '✓ Copied!' : '🔗 Share'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10" id="main-content">

        {/* Hero Summary */}
        <section
          aria-label="Audit summary"
          className="mb-8 p-6 sm:p-8 rounded-2xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 0 80px rgba(99,102,241,0.06)',
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left — numbers */}
            <div className="flex-1">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Audit complete · {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              {isWellOptimized ? (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#34d399' }}>
                    You&apos;re spending well.
                  </h1>
                  <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Your AI stack appears well-optimized for your team size and use case.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    <span style={{ color: '#10b981' }}>
                      {formatCurrency(report.totalAnnualSavings)}
                    </span>
                    <span className="text-xl font-normal ml-2" style={{ color: 'var(--text-secondary)' }}>
                      /year in savings found
                    </span>
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(report.totalMonthlySavings)}/month · {report.wastePercentage.toFixed(0)}% of current spend
                  </p>
                </>
              )}

              {/* Metrics row */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Monthly spend </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(report.totalMonthlySpend)}</strong>
                </div>
                <div
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>vs. industry avg </span>
                  <strong style={{ color: report.benchmarkData.overspendPercentage > 0 ? '#f87171' : '#34d399' }}>
                    {report.benchmarkData.overspendPercentage > 0 ? '+' : ''}
                    {report.benchmarkData.overspendPercentage.toFixed(0)}%
                  </strong>
                </div>
                <div
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Benchmark </span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Top {100 - report.benchmarkPercentile}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Right — score */}
            <div className="flex flex-col items-center gap-2 lg:ml-auto">
              <ScoreGauge score={report.optimizationScore} />
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Optimization score
              </p>
            </div>
          </div>

          {/* AI Summary */}
          {report.aiSummary && (
            <div
              className="mt-6 pt-6 text-sm leading-relaxed"
              style={{
                borderTop: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#818cf8' }}>
                ✦ AI Executive Summary
              </p>
              <p>{report.aiSummary}</p>
            </div>
          )}
        </section>

        {/* Consultation callout */}
        {qualifiesForConsult && (
          <section
            aria-label="Credex consultation offer"
            className="mb-8 p-5 rounded-2xl flex items-start gap-4"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">⚡</span>
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#a5b4fc' }}>
                You qualify for a Credex optimization review
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                With {formatCurrency(report.totalAnnualSavings)}/year identified, our team typically uncovers 2-3× more in a 30-minute call.
                Enter your email below to book a free session — no commitment required.
              </p>
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section aria-label="Recommendations" className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {savingsRecs.length > 0
              ? `${savingsRecs.length} optimization${savingsRecs.length > 1 ? 's' : ''} found`
              : 'Your tools are well-configured'}
          </h2>
          <div className="space-y-3">
            {report.recommendations
              .slice()
              .sort((a, b) => b.annualSavings - a.annualSavings)
              .map((rec, i) => (
                <RecommendationCard key={rec.toolName} rec={rec} rank={i + 1} />
              ))}
          </div>
        </section>

        {/* Benchmark */}
        <section
          aria-label="Industry benchmark"
          className="mb-8 p-6 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Benchmark comparison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Your spend / person</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(report.benchmarkData.userSpendPerPerson)}/mo
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                Industry avg ({report.benchmarkData.teamSizeBucket} {report.primaryUseCase})
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(report.benchmarkData.industryAveragePerPerson)}/mo
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Percentile</p>
              <p className="text-2xl font-bold" style={{ color: report.benchmarkPercentile > 60 ? '#10b981' : '#f87171' }}>
                {report.benchmarkPercentile}th
              </p>
            </div>
          </div>
          {/* Bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (report.benchmarkData.userSpendPerPerson / (report.benchmarkData.industryAveragePerPerson * 2)) * 100)}%`,
                  background: report.benchmarkData.overspendPercentage > 0
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #6366f1, #10b981)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>$0</span>
              <span>Industry avg</span>
              <span>2×</span>
            </div>
          </div>
        </section>

        {/* Email Capture — shown AFTER all results */}
        <section aria-label="Get your report by email">
          <EmailCapture shareId={shareId} savings={report.totalAnnualSavings} />
        </section>

        {/* Share */}
        <section
          aria-label="Share this report"
          className="mt-8 p-5 rounded-2xl text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Share this audit with your team or investors
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              readOnly
              value={shareUrl}
              className="input-base flex-1 px-3 py-2 text-sm font-mono"
              aria-label="Shareable report URL"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0"
              style={{
                background: copied ? 'rgba(16,185,129,0.15)' : 'var(--surface-2)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                color: copied ? '#34d399' : 'var(--text-secondary)',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center" role="contentinfo">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Audit by{' '}
            <Link href="/" style={{ color: '#818cf8' }}>
              Credex AI Spend Auditor
            </Link>{' '}
            · Pricing verified May 2026 · Report ID: {shareId}
          </p>
        </footer>
      </main>
    </div>
  );
}
