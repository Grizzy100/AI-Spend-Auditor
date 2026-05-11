import Link from 'next/link';

export function Navbar() {
  return (
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
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              A
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Auditly
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>
              How it Works
            </Link>
            <Link href="#audit-logic" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Audit Logic
            </Link>
            <Link href="/report" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Sample Report
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>
              FAQ
            </Link>
          </div>
        </div>
        <Link
          href="/audit"
          className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(99,102,241,0.2)',
          }}
        >
          Run Free Audit
        </Link>
      </div>
    </nav>
  );
}
