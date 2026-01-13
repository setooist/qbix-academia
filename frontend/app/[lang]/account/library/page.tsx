'use client';

import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LibraryPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 flex-grow bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">My Library</h1>

          <Card className="max-w-2xl mx-auto border-2 shadow-lg">
            <CardContent className="text-center py-16">
              <svg className="w-48 h-48 mx-auto mb-6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="libraryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0.8 }} />
                  </linearGradient>
                </defs>
                <rect x="50" y="60" width="100" height="120" rx="4" fill="url(#libraryGrad)" opacity="0.1" />
                <rect x="60" y="70" width="15" height="80" rx="2" fill="url(#libraryGrad)" opacity="0.6" />
                <rect x="80" y="65" width="15" height="85" rx="2" fill="url(#libraryGrad)" opacity="0.7" />
                <rect x="100" y="70" width="15" height="80" rx="2" fill="url(#libraryGrad)" opacity="0.6" />
                <rect x="120" y="60" width="15" height="90" rx="2" fill="url(#libraryGrad)" opacity="0.8" />
                <path d="M 100 30 L 110 45 L 125 45 L 113 55 L 118 70 L 100 60 L 82 70 L 87 55 L 75 45 L 90 45 Z" fill="url(#libraryGrad)" opacity="0.5" />
              </svg>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Your Library is Empty</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Save articles, resources, and content to access them later. Your saved items will appear here for quick access.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
