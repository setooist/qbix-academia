'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getActivities, Activity } from '@/lib/api/activities';

export default function ActivityManagement() {
  console.log('Admin Activity Page: COMPONENT RENDER START');
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Debugging: Log permissions state
  console.log('Admin Activity Page: Permissions Loading State:', loading);
  console.log('Admin Activity Page: Has Permission State:', hasPermission('activities.read'));

  useEffect(() => {
    // Force fetch on mount
    console.log('Admin Activity Page: Mount Effect - Calling fetchActivities');
    async function fetchActivities() {
      try {
        const data = await getActivities();
        console.log('Admin Activity Page: Fetched Data:', data);
        setActivities(data);
      } catch (err) {
        console.error('Admin Activity Page: Fetch Error:', err);
      } finally {
        setLoadingActivities(false);
      }
    }
    fetchActivities();
  }, []); // Run ONCE on mount

  // Temporarily commented out loading check to force render
  /*
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
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Management</h1>
            <p className="text-gray-600 mt-2">Manage activity templates and student assignments</p>
          </div>
          {/* Always show button for debug */
            /* {hasPermission('activities.create') && ( */
            <Button onClick={() => router.push('/admin/activities/create')}>
              Create Activity
            </Button>
            /* )} */
          }
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Activities</CardTitle>
            <CardDescription>
              View and manage all activities across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingActivities ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading activities...</p>
              </div>
            ) : (
              activities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No activities found. Create one to get started.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map(activity => (
                        <TableRow key={activity.documentId} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>{activity.assignee?.username || 'Unassigned'}</TableCell>
                          <TableCell>{activity.category?.name || '-'}</TableCell>
                          <TableCell>
                            <ActivityStatusBadge status={activity.activityStatus} />
                          </TableCell>
                          <TableCell>{activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/activities/${activity.documentId}`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivityStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    assigned: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-indigo-100 text-indigo-800',
    under_review: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    changes_requested: 'bg-red-100 text-red-800'
  };

  const label = status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {label}
    </span>
  );
}