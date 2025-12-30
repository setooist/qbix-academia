'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, Activity, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
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

  if (!isAdmin()) {
    return null;
  }

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
    },
    {
      title: 'Role Management',
      description: 'Configure roles and permissions',
      icon: Shield,
      href: '/admin/roles',
      color: 'text-purple-600',
    },
    {
      title: 'Content Management',
      description: 'Manage blogs, case studies, and resources',
      icon: FileText,
      href: '/admin/content',
      color: 'text-green-600',
    },
    {
      title: 'Event Management',
      description: 'Manage events and registrations',
      icon: Calendar,
      href: '/admin/events',
      color: 'text-orange-600',
    },
    {
      title: 'Activity Management',
      description: 'Manage activities and assignments',
      icon: Activity,
      href: '/admin/activities',
      color: 'text-pink-600',
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange opacity-5 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your QBIX Academia platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary group bg-white">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{card.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}