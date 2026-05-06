import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Not Found',
};

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="text-8xl font-black mb-4 opacity-10"
        style={{ color: 'var(--text-primary)' }}
        aria-hidden="true"
      >
        404
      </div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        Report not found
      </h1>
      <p className="mb-8 text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        This audit report doesn&apos;t exist or may have expired. Run a new audit to get fresh results.
      </p>
      <Link
        href="/audit"
        className="px-6 py-3 rounded-xl font-semibold text-sm"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
        }}
      >
        Run new audit →
      </Link>
    </main>
  );
}
