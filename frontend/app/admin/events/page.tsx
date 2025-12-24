'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventManagement() {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();

  useEffect(() => {
    if (!loading && !hasPermission('events.read')) {
      router.push('/');
    }
  }, [hasPermission, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">Manage events and registrations</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="eventGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <rect x="50" y="50" width="100" height="110" rx="8" fill="url(#eventGrad)" opacity="0.2" />
                <rect x="50" y="40" width="100" height="15" rx="4" fill="url(#eventGrad)" />
                <circle cx="65" cy="47.5" r="3" fill="white" />
                <circle cx="135" cy="47.5" r="3" fill="white" />
                <line x1="60" y1="65" x2="140" y2="65" stroke="url(#eventGrad)" strokeWidth="1" opacity="0.3" />
                <rect x="60" y="75" width="25" height="25" rx="4" fill="url(#eventGrad)" opacity="0.4" />
                <rect x="90" y="75" width="25" height="25" rx="4" fill="url(#eventGrad)" opacity="0.4" />
                <rect x="120" y="75" width="25" height="25" rx="4" fill="url(#eventGrad)" opacity="0.6" />
                <rect x="60" y="105" width="25" height="25" rx="4" fill="url(#eventGrad)" opacity="0.4" />
                <rect x="90" y="105" width="25" height="25" rx="4" fill="url(#eventGrad)" opacity="0.4" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-base mt-2">Event management features will be available here</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This section will allow you to create, edit, and manage events and registrations.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-orange/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Create Events</p>
                <p className="text-sm text-gray-600 mt-1">Schedule and publish events</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Track Registrations</p>
                <p className="text-sm text-gray-600 mt-1">Manage attendee lists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}