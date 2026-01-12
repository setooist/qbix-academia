'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMyAssignments, Assignment } from '@/lib/api/assignments';
import { Clock, ArrowRight } from 'lucide-react';
import { localeConfig } from '@/config/locale-config';

export function StudentActivitiesDashboard() {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || 'en';
    const { user, loading: authLoading } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    const urlPrefix = localeConfig.multilanguage.enabled ? `/${lang}` : '';

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`${urlPrefix}/auth/login`);
        }
    }, [user, authLoading, router, lang, urlPrefix]);

    useEffect(() => {
        async function fetchAssignments() {
            // Use documentId if available, fallback to id (if backend supports it or if they are the same)
            // But since we updated backend to filter by documentId, we MUST prefer documentId.
            const userId = user?.documentId || user?.id;

            if (userId) {
                try {
                    const data = await getMyAssignments(userId);
                    setAssignments(data);
                } catch (error) {
                    console.error('Failed to fetch assignments:', error);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading && !user) {
                // handle case where user is null but auth finished
                setLoading(false);
            }
        }
        fetchAssignments();
    }, [user, authLoading]);

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
                {assignments.map((assignment) => (
                    <Card key={assignment.documentId} className="flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                    {formatStatus(assignment.status)}
                                </div>
                                {assignment.dueDate && (
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(assignment.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-xl mt-2 line-clamp-2">{assignment.activity?.title || 'Untitled Activity'}</CardTitle>
                            <CardDescription className="line-clamp-2">{assignment.activity?.excerpt || ''}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end pt-0">
                            <Button className="w-full mt-4 group" asChild>
                                <Link href={`${urlPrefix}/account/activities/${assignment.activity?.slug || ''}`}>
                                    View details
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {assignments.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                        <p className="text-gray-500">No activities assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusColor(status: string | null | undefined) {
    if (!status) return 'bg-gray-100 text-gray-800';
    const map: Record<string, string> = {
        not_started: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        needs_changes: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string | null | undefined) {
    if (!status) return 'Unknown';
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
