'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMentorAssignments, Assignment } from '@/lib/api/assignments';
import { localeConfig } from '@/config/locale-config';
import {
    Users,
    ClipboardCheck,
    Clock,
    CheckCircle,
    Eye,
    ArrowRight
} from 'lucide-react';

export function ActivityManagementView() {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || 'en';
    const { user, loading: authLoading } = useAuth();
    const { isActivityManager, loading: permLoading } = usePermissions();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    const urlPrefix = localeConfig.multilanguage.enabled ? `/${lang}` : '';

    useEffect(() => {
        if (!authLoading && !permLoading) {
            if (!user) {
                router.push(`${urlPrefix}/auth/login`);
            } else {
                // Use consistent permission check
                if (!isActivityManager()) {
                    router.push(`${urlPrefix}/account/profile`);
                }
            }
        }
    }, [user, authLoading, permLoading, isActivityManager, router, lang, urlPrefix]);

    useEffect(() => {
        async function fetchData() {
            // Use documentId if available, fallback to id
            const userId = user?.documentId || user?.id;

            if (userId) {
                try {
                    const data = await getMentorAssignments(userId);
                    setAssignments(data);
                } catch (error) {
                    console.error('Failed to fetch assignments:', error);
                }
                setLoading(false);
            }
        }
        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Group assignments by status
    const pendingReview = assignments.filter((a) =>
        a.status === 'submitted' ||
        a.status === 'under_review' ||
        (a.status === 'in_progress' && a.submissionUploads && a.submissionUploads.length > 0)
    );
    const inProgress = assignments.filter((a) =>
        (a.status === 'in_progress' && (!a.submissionUploads || a.submissionUploads.length === 0)) ||
        a.status === 'needs_changes'
    );
    const approved = assignments.filter((a) => a.status === 'approved');
    const assigned = assignments.filter((a) => a.status === 'not_started');

    const stats = [
        { label: 'Pending Review', value: pendingReview.length, icon: ClipboardCheck, color: 'text-yellow-600 bg-yellow-100' },
        { label: 'Total Assigned', value: assignments.length, icon: Users, color: 'text-purple-600 bg-purple-100' },
        { label: 'In Progress', value: inProgress.length, icon: Clock, color: 'text-blue-600 bg-blue-100' },
        { label: 'Approved', value: approved.length, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Activity Management</h1>
                    <p className="text-gray-600 mt-2">Review and manage student submissions</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="border-2">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold">{stat.value}</p>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content */}
                <Tabs defaultValue="review" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="review" className="relative">
                            Pending Review
                            {pendingReview.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                                    {pendingReview.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="assigned">Assigned</TabsTrigger>
                        <TabsTrigger value="progress">In Progress</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                    </TabsList>

                    {/* Pending Review Tab */}
                    <TabsContent value="review">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ClipboardCheck className="w-5 h-5 mr-2 text-yellow-600" />
                                    Submissions Awaiting Review
                                </CardTitle>
                                <CardDescription>
                                    Student submissions that need your attention
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingReview.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
                                        <p>All caught up! No pending reviews.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Activity</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Submitted</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pendingReview.map((assignment) => (
                                                    <TableRow key={assignment.documentId} className="hover:bg-yellow-50">
                                                        <TableCell className="font-medium">{assignment.activity?.title || 'Unknown'}</TableCell>
                                                        <TableCell>
                                                            {assignment.user ? (
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{assignment.user.fullName || 'No Name'}</span>
                                                                    <span className="text-xs text-gray-500">{assignment.user.username}</span>
                                                                </div>
                                                            ) : (
                                                                'Unknown'
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {assignment.dueDate
                                                                ? new Date(assignment.dueDate).toLocaleDateString()
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <StatusBadge status={assignment.status} />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => router.push(`${urlPrefix}/account/activity-management/${assignment.documentId}`)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Review
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* In Progress Tab */}
                    <TabsContent value="progress">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    Activities In Progress
                                </CardTitle>
                                <CardDescription>
                                    Students currently working on these activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ActivityTable
                                    assignments={inProgress}
                                    onView={(id) => router.push(`${urlPrefix}/account/activity-management/${id}`)}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Assigned Tab */}
                    <TabsContent value="assigned">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                                    Newly Assigned
                                </CardTitle>
                                <CardDescription>
                                    Activities assigned but not yet started
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ActivityTable
                                    assignments={assigned}
                                    onView={(id) => router.push(`${urlPrefix}/account/activity-management/${id}`)}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Approved Tab */}
                    <TabsContent value="approved">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Approved Activities
                                </CardTitle>
                                <CardDescription>
                                    Completed and approved student work
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ActivityTable
                                    assignments={approved}
                                    onView={(id) => router.push(`${urlPrefix}/account/activity-management/${id}`)}
                                    showGrade
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function ActivityTable({
    assignments,
    onView,
    showGrade = false
}: {
    assignments: Assignment[];
    onView: (id: string) => void;
    showGrade?: boolean;
}) {
    if (assignments.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No activities in this category.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        {showGrade && <TableHead>Grade</TableHead>}
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assignments.map((assignment) => (
                        <TableRow key={assignment.documentId}>
                            <TableCell className="font-medium">{assignment.activity?.title || 'Unknown'}</TableCell>
                            <TableCell>
                                {assignment.user ? (
                                    <div className="flex flex-col">
                                        <span className="font-medium">{assignment.user.fullName || 'No Name'}</span>
                                        <span className="text-xs text-gray-500">{assignment.user.username}</span>
                                    </div>
                                ) : (
                                    'Unknown'
                                )}
                            </TableCell>
                            <TableCell>
                                {assignment.dueDate
                                    ? new Date(assignment.dueDate).toLocaleDateString()
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={assignment.status} />
                            </TableCell>
                            {showGrade && (
                                <TableCell>
                                    <span className="font-bold">{assignment.grade ?? '-'}</span>
                                    <span className="text-gray-400">/100</span>
                                </TableCell>
                            )}
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => onView(assignment.documentId)}>
                                    Review
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }: { status: string | null | undefined }) {
    const styles: Record<string, string> = {
        not_started: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        needs_changes: 'bg-red-100 text-red-800',
    };

    const safeStatus = status || 'not_started';
    const label = safeStatus.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <Badge className={`${styles[safeStatus] || 'bg-gray-100 text-gray-800'} border-0`}>
            {label}
        </Badge>
    );
}
