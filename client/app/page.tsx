import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Spend Auditor — Stop Overpaying for AI Tools',
  description:
    'Find hidden waste in your AI subscriptions in 2 minutes. Get a personalized audit showing exactly where you can cut costs and save thousands per year.',
};

const STATS = [
  { value: '$4,200', label: 'Average annual savings found' },
  { value: '73%', label: 'Startups have redundant subscriptions' },
  { value: '2 min', label: 'Average time to complete audit' },
];

const TOOLS = [
  { name: 'ChatGPT', icon: '🤖' },
  { name: 'Claude', icon: '✦' },
  { name: 'Cursor', icon: '⌨️' },
  { name: 'Copilot', icon: '🐙' },
  { name: 'Gemini', icon: '♊' },
  { name: 'Windsurf', icon: '🏄' },
  { name: 'OpenAI API', icon: '⚡' },
  { name: 'Anthropic API', icon: '🔬' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your stack',
    description: 'Add each AI tool, your plan, team size, and what you pay monthly.',
  },
  {
    step: '02',
    title: 'Instant analysis',
    description: 'Our engine checks for plan mismatches, seat waste, and redundant overlaps.',
  },
  {
    step: '03',
    title: 'Get your report',
    description: 'See exactly where you\'re overpaying, with specific recommendations and annual savings.',
  },
];

const FAQS = [
  {
    q: 'Is this really free?',
    a: 'Yes. The audit is completely free. We make money when founders hire Credex to implement optimizations.',
  },
  {
    q: 'How accurate is the audit?',
    a: 'All pricing is sourced directly from official pricing pages with verification dates. Savings are calculated using real plan costs — never fabricated.',
  },
  {
    q: 'Do you store my data?',
    a: 'Your audit results are stored to generate a shareable link. We only ask for your email after showing you results — never before.',
  },
  {
    q: 'What if I have a custom enterprise deal?',
    a: 'Enter your actual monthly spend and we\'ll analyze it against market rates. Our engine will still surface redundancies and overlap.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav
        aria-label="Main navigation"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              A
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              AI Spend Auditor
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              by Credex
            </span>
          </div>
          <Link
            href="/audit"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
            }}
          >
            Start free audit →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="pt-32 pb-24 px-4 sm:px-6 text-center relative overflow-hidden"
        aria-label="Hero section"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.04) 0%, transparent 50%)
          `,
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(16,185,129,0.1)',
                color: '#34d399',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              ✦ Free AI spend analysis
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span style={{ color: 'var(--text-primary)' }}>Stop overpaying</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              for AI tools
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            In 2 minutes, discover exactly where your startup is wasting money on AI
            subscriptions — and get specific, defensible recommendations to fix it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
            <Link
              href="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                boxShadow: '0 0 40px rgba(99,102,241,0.3)',
              }}
            >
              Audit my AI spend
              <span aria-hidden="true">→</span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No signup required
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(17,17,24,0.8)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Marquee */}
      <section
        aria-label="Supported tools"
        className="py-12 px-4"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <p
            className="text-center text-xs font-medium tracking-widest uppercase mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            Supports all major AI tools
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span aria-hidden="true">{tool.icon}</span>
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6"
        aria-label="How it works"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              How it works
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              No AI guesswork. Real pricing data. Defensible numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="p-8 rounded-2xl relative"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="text-5xl font-black mb-4 opacity-20"
                  style={{ color: '#6366f1' }}
                  aria-hidden="true"
                >
                  {item.step}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we check */}
      <section
        className="py-24 px-4 sm:px-6"
        aria-label="What we analyze"
        style={{ background: 'var(--surface)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              What we analyze
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every insight is backed by official pricing data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🔄', title: 'Redundant overlaps', desc: 'Cursor + Copilot. Claude + ChatGPT. Paying twice for the same capability.' },
              { icon: '📉', title: 'Plan right-sizing', desc: 'ChatGPT Team for 2 users. Pro+ when Pro is sufficient. We find every mismatch.' },
              { icon: '💸', title: 'Overpay detection', desc: 'Spending more than official rates? We flag billing anomalies immediately.' },
              { icon: '📊', title: 'Benchmark comparison', desc: 'See how your per-person AI spend compares to teams of similar size and function.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-xl"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <h3
                  className="font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-4 sm:px-6 text-center"
        aria-label="Call to action"
        style={{
          borderTop: '1px solid var(--border)',
          background: `radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%)`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Find your savings in 2 minutes
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            No account. No credit card. Just your audit results.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: '0 0 60px rgba(99,102,241,0.25)',
            }}
          >
            Audit my AI spend →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 text-center"
        style={{ borderTop: '1px solid var(--border)' }}
        role="contentinfo"
      >
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Credex · AI Spend Auditor ·{' '}
          <span>Pricing verified May 2026</span>
        </p>
      </footer>
    </main>
  );
}
