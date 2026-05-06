import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shareId = searchParams.get('shareId') ?? '';

  let savings = 0;
  let score = 0;
  let toolCount = 0;

  try {
    const res = await fetch(`${API_URL}/api/report/${shareId}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as { report: { totalAnnualSavings: number; optimizationScore: number; tools: unknown[] } };
      savings = data.report.totalAnnualSavings;
      score = data.report.optimizationScore;
      toolCount = data.report.tools.length;
    }
  } catch {
    // use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#0a0a0f',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            A
          </div>
          <span style={{ color: '#94a3b8', fontSize: 18, fontWeight: 500 }}>
            AI Spend Auditor · Credex
          </span>
        </div>

        {/* Main message */}
        {savings > 0 ? (
          <>
            <div style={{ color: '#10b981', fontSize: 60, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
              ${savings.toLocaleString()}/year
            </div>
            <div style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 600, marginBottom: 12 }}>
              in AI savings identified
            </div>
          </>
        ) : (
          <div style={{ color: '#f1f5f9', fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            AI Spend Audit Results
          </div>
        )}

        {/* Pills */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <div
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 100,
              padding: '8px 20px',
              color: '#a5b4fc',
              fontSize: 16,
            }}
          >
            Score {score}/100
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '8px 20px',
              color: '#94a3b8',
              fontSize: 16,
            }}
          >
            {toolCount} tools audited
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
