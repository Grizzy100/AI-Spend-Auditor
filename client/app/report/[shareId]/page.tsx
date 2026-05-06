import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ReportClient from './ReportClient';
import type { AuditReport } from '@/types';

interface Props {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai-spend-auditor.vercel.app';

  try {
    const { report } = await api.getReport(shareId);
    const savings = report.totalAnnualSavings;
    const title =
      savings > 0
        ? `AI Audit: $${savings.toLocaleString()}/year in savings found`
        : 'AI Spend Audit Results';
    const description = `Optimization score: ${report.optimizationScore}/100. ${report.biggestInefficiency}`;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        title,
        description,
        url: `${APP_URL}/report/${shareId}`,
        images: [
          {
            url: `${APP_URL}/api/og?shareId=${shareId}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${APP_URL}/api/og?shareId=${shareId}`],
      },
    };
  } catch {
    return {
      title: 'AI Spend Audit Report',
      description: 'View your personalized AI subscription audit results.',
    };
  }
}

export default async function ReportPage({ params }: Props) {
  const { shareId } = await params;

  let report: AuditReport;
  try {
    const res = await api.getReport(shareId);
    report = res.report;
  } catch {
    notFound();
  }

  return <ReportClient report={report} shareId={shareId} />;
}
