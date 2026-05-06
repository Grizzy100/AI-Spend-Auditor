import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai-spend-auditor.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'AI Spend Auditor — Stop Overpaying for AI Tools',
    template: '%s | AI Spend Auditor',
  },
  description:
    'Instantly audit your AI tool subscriptions. Find hidden waste, get plan recommendations, and see exactly how much you can save. Free tool by Credex.',
  keywords: [
    'AI tools cost',
    'ChatGPT cost',
    'Cursor vs Copilot',
    'AI subscription audit',
    'reduce AI spend',
    'startup AI tools',
  ],
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    siteName: 'AI Spend Auditor by Credex',
    title: 'AI Spend Auditor — Stop Overpaying for AI Tools',
    description:
      'Audit your AI subscriptions in 2 minutes. See exactly where you are wasting money and how much you can save.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Spend Auditor — Free audit tool by Credex',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Auditor — Stop Overpaying for AI Tools',
    description:
      'Audit your AI subscriptions in 2 minutes. See exactly where you are wasting money.',
    images: ['/og-image.png'],
    creator: '@credex_hq',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
      >
        {children}
      </body>
    </html>
  );
}
