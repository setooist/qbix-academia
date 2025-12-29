import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { LoadingBar } from '@/components/ui/loading-bar';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'QBIX Academia - Stand Overseas',
  description: 'Your gateway to international education. Expert guidance for studying abroad.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingBar />
        <AuthProvider>
          <Navigation />
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
