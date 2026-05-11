import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Auditly — Cut Your AI Spend Without Guesswork',
  description:
    'Analyze ChatGPT, Claude, Cursor, Copilot, and API costs. Get actionable savings recommendations instantly — no signup required.',
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
      <Navbar />

      {/* Hero */}
      <Hero />

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

      {/* Audit Logic (formerly What we analyze) */}
      <section
        id="audit-logic"
        className="py-24 px-4 sm:px-6"
        aria-label="Audit logic"
        style={{ background: 'var(--surface)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Audit Logic
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
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
