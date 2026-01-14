'use client';

import { useEffect, useState } from 'react';
import { getActivities, Activity } from '@/lib/api/activities';
import { ActivityList } from '@/components/activities/activity-list';
import { useAuth } from '@/lib/contexts/auth-context';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ActivitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchData() {
      // Attempt fetch regardless of auth state (public activities might exist)
      // console.log('Activities Page (Client): Fetching activities...');
      try {
        const resolvedParams = await params;
        const data = await getActivities(resolvedParams.lang);
        // console.log('Activities Page (Client): Data received:', data);
        setActivities(data);
      } catch (e) {
        console.error("Fetch activities failed (likely permission denied for guest):", e);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [params, authLoading]); // Removed 'user' dependency to avoid redundant logic

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Activities</h1>
            <p className="text-xl text-gray-200">
              Track your tasks and assignments
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Show loader only if we are still figuring out Auth or Fetching */}
          {loading || authLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              {/* Always render list if we have activities */}
              {activities.length > 0 ? (
                <ActivityList activities={activities} />
              ) : (
                /* Empty State handling */
                <div className="text-center py-12 text-gray-500">
                  {!user ? (
                    /* Not logged in? Show "Login Required" card INSTEAD of list, but INSIDE the page structure */
                    <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg border border-gray-100">
                      <Lock className="w-10 h-10 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                      <p className="text-gray-600 mb-6">Sign in to view your assigned activities.</p>
                      <div className="flex justify-center gap-4">
                        <Button asChild>
                          <Link href="/auth/login">Log In</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Logged in but truly empty */
                    <p>No activities found.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
