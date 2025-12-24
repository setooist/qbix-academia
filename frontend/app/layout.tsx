import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'QBIX Academia - Stand Overseas',
  description: 'Your gateway to international education. Expert guidance for studying abroad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
