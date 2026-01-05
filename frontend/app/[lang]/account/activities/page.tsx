'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActivities, Activity } from '@/lib/api/activities';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StudentActivities() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchActivities() {
            if (user) {
                // In a real app, we would filter by assignee using the API. 
                // For now, fetching all and filtering client-side or showing all for demo.
                const data = await getActivities();
                // Filter for "my" activities if assignee logic was strict, 
                // but for now we'll show all or use backend filtering if implemented.
                setActivities(data);
                setLoading(false);
            }
        }
        if (user) {
            fetchActivities();
        }
    }, [user]);

    if (loading || authLoading) {
        return <div className="p-8 text-center">Loading your activities...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
                <p className="text-gray-600 mt-2">Track your assignments, deadlines, and submissions.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity) => (
                    <Card key={activity.documentId} className="flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.activityStatus)}`}>
                                    {formatStatus(activity.activityStatus)}
                                </div>
                                {activity.dueDate && (
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(activity.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-xl mt-2 line-clamp-2">{activity.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{activity.excerpt}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end pt-0">
                            <Button className="w-full mt-4 group" onClick={() => router.push(`/account/activities/${activity.slug}`)}>
                                View details
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {activities.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                        <p className="text-gray-500">No activities assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    const map: Record<string, string> = {
        assigned: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        reviewed: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        changes_requested: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string) {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
