'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentManagement() {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();

  useEffect(() => {
    if (!loading && !hasPermission('content.read')) {
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
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage blogs, case studies, and downloadable resources</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="contentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <rect x="40" y="60" width="120" height="100" rx="8" fill="url(#contentGrad)" opacity="0.2" />
                <rect x="50" y="70" width="100" height="6" rx="3" fill="url(#contentGrad)" />
                <rect x="50" y="85" width="80" height="4" rx="2" fill="url(#contentGrad)" opacity="0.6" />
                <rect x="50" y="95" width="90" height="4" rx="2" fill="url(#contentGrad)" opacity="0.6" />
                <rect x="50" y="105" width="70" height="4" rx="2" fill="url(#contentGrad)" opacity="0.6" />
                <circle cx="160" cy="50" r="25" fill="url(#contentGrad)" opacity="0.3" />
                <path d="M 155 45 L 158 50 L 165 43" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-base mt-2">Content management features will be available here</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This section will allow you to create, edit, and manage all content on the platform.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-primary/5 to-orange/5 rounded-lg">
                <p className="font-medium text-gray-900">Blogs</p>
                <p className="text-sm text-gray-600 mt-1">Create and publish articles</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/5 to-orange/5 rounded-lg">
                <p className="font-medium text-gray-900">Case Studies</p>
                <p className="text-sm text-gray-600 mt-1">Share success stories</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/5 to-orange/5 rounded-lg">
                <p className="font-medium text-gray-900">Resources</p>
                <p className="text-sm text-gray-600 mt-1">Manage downloadables</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}