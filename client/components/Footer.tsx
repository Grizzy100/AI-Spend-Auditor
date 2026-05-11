import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="py-16 px-4 sm:px-6"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <div
              aria-hidden="true"
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              A
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Auditly
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI spend intelligence for modern engineering teams.
          </p>
        </div>
        <div className="flex gap-12 sm:gap-24">
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Product</h4>
            <ul className="space-y-3 text-sm flex flex-col" style={{ color: 'var(--text-secondary)' }}>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/report" className="hover:text-white transition-colors">Sample Report</Link></li>
              <li><Link href="#audit-logic" className="hover:text-white transition-colors">Audit Logic</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-3 text-sm flex flex-col" style={{ color: 'var(--text-secondary)' }}>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <p>Built for AI-heavy startups and engineering teams.</p>
        <p>Powered by Credex infrastructure pricing data.</p>
      </div>
    </footer>
  );
}
