'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivityManagement() {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();

  useEffect(() => {
    if (!loading && !hasPermission('activities.read')) {
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
          <h1 className="text-3xl font-bold text-gray-900">Activity Management</h1>
          <p className="text-gray-600 mt-2">Manage activities and assignments</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="activityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ec4899', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="60" fill="url(#activityGrad)" opacity="0.2" />
                <path d="M 80 100 L 95 115 L 120 85" stroke="url(#activityGrad)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="140" cy="70" r="15" fill="url(#activityGrad)" opacity="0.3" />
                <circle cx="60" cy="70" r="15" fill="url(#activityGrad)" opacity="0.3" />
                <circle cx="140" cy="130" r="15" fill="url(#activityGrad)" opacity="0.3" />
                <path d="M 135 67 L 138 72 L 145 65" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-base mt-2">Activity management features will be available here</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This section will allow you to create templates, assign activities, and review submissions.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-pink/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Templates</p>
                <p className="text-sm text-gray-600 mt-1">Create activity templates</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Assignments</p>
                <p className="text-sm text-gray-600 mt-1">Assign to students</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Review</p>
                <p className="text-sm text-gray-600 mt-1">Grade and provide feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}