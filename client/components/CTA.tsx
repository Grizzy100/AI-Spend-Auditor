import Link from 'next/link';

export function CTA() {
  return (
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
          Most Teams Overpay for AI Tools
        </h2>
        <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
          See where your stack is inefficient, overpriced, or incorrectly sized — and what to change immediately.
        </p>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95 mb-6"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            boxShadow: '0 0 60px rgba(99,102,241,0.25)',
          }}
        >
          Run Your Free Audit →
        </Link>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          No integrations. No credit card. Instant results.
        </p>
      </div>
    </section>
  );
}
