'use client';

import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyActivitiesPage() {
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
      <section className="py-20 flex-grow bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">My Activities</h1>

          <Card className="max-w-2xl mx-auto border-2">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange rounded-full mb-6">
                <CheckSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">No Activities Yet</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your assigned activities and tasks will appear here. Check back later for updates on your study abroad journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
