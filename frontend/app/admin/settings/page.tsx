'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemSettings() {
  const router = useRouter();
  const { isAdmin, loading } = usePermissions();

  useEffect(() => {
    if (!loading && !isAdmin()) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

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
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system settings and preferences</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#6b7280', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="30" fill="url(#settingsGrad)" opacity="0.3" />
                <circle cx="100" cy="100" r="15" fill="url(#settingsGrad)" />
                <g transform="rotate(0 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
                <g transform="rotate(60 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
                <g transform="rotate(120 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
                <g transform="rotate(180 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
                <g transform="rotate(240 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
                <g transform="rotate(300 100 100)">
                  <rect x="95" y="50" width="10" height="20" rx="2" fill="url(#settingsGrad)" opacity="0.6" />
                </g>
              </svg>
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-base mt-2">System settings will be available here</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This section will allow you to configure system-wide settings and preferences.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-gray/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Site Configuration</p>
                <p className="text-sm text-gray-600 mt-1">General site settings</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray/5 to-primary/5 rounded-lg">
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600 mt-1">Email and system alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}