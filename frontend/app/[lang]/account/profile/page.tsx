'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StudentProfileForm } from '@/components/account/student-profile-form';
import { UserProfileForm } from '@/components/account/user-profile-form';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { isStudent, loading: permLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || permLoading || !user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 flex-grow bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isStudent() ? (
            <StudentProfileForm />
          ) : (
            <UserProfileForm />
          )}
        </div>
      </section>
    </div>
  );
}
