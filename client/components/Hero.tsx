import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden"
      aria-label="Hero section"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.04) 0%, transparent 50%)
        `,
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                background: 'rgba(99,102,241,0.1)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              New — Audit ChatGPT, Claude, Cursor & API spend instantly
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Cut Your AI Spend</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Without Guesswork
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-xl mb-10 leading-relaxed font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Analyze ChatGPT, Claude, Cursor, Copilot, and API costs. Get actionable savings recommendations instantly — no signup required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <Link
              href="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(99,102,241,0.3)',
              }}
            >
              Run Free Audit
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all border hover:bg-white/5 active:scale-95"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              View Sample Report
            </Link>
          </div>
          
          <p className="text-sm font-medium flex items-center gap-2 ml-1" style={{ color: 'var(--text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            No login required • Results in under 60 seconds
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative hidden lg:block">
          <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent border border-white/10 overflow-hidden glow-primary">
            <div className="bg-slate-950/80 backdrop-blur-xl p-8 rounded-[15px] space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-indigo-400">📊</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Operational Audit</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">In Progress</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Analyzed</div>
                  <div className="text-sm font-mono text-indigo-300">$2,450/mo</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Unused Seats Detected', color: 'text-red-400', bg: 'bg-red-400/10', icon: '⚠️' },
                  { label: 'Potential Savings: $740/mo', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: '💰' },
                  { label: 'Claude Team → Claude Pro', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: '📉' },
                  { label: 'OpenAI API Spend Above Benchmark', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: '📈' },
                  { label: 'Retail Pricing Detected', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: '🎫' },
                ].map((item, i) => (
                  <div 
                    key={item.label}
                    className={`flex items-center justify-between p-3 rounded-lg border border-white/5 ${item.bg} backdrop-blur-sm transition-all hover:scale-[1.02]`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{item.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-tight ${item.color}`}>{item.label}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Confidence Score</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">98% High</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
