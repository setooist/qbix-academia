import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'QBIX Academia - Stand Overseas',
  description: 'Your gateway to international education. Expert guidance for studying abroad.',
  icons: {
    icon: '/logo.png',
  },
};

import { i18nConfig } from '@/config/i18n';

import { Suspense } from 'react';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>
        <AuthProvider>
          <Suspense fallback={<div className="h-20 bg-white/80" />}>
            <Navigation />
          </Suspense>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
