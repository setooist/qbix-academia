'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActivityBySlug, Activity } from '@/lib/api/activities';
import { startActivity, updateActivityStatus } from '@/lib/api/activity-mutations';
import { FileUpload } from '@/components/activities/file-upload';
import { FeedbackThread } from '@/components/activities/feedback-thread';
import {
    Calendar,
    Download,
    Clock,
    CheckCircle,
    FileText,
    Play,
    MessageSquare,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function StudentActivityDetail({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function resolveParams() {
            const p = await params;
            setSlug(p.slug);
        }
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    const fetchData = useCallback(async () => {
        if (slug) {
            const data = await getActivityBySlug(slug);
            setActivity(data);
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug && user) {
            fetchData();
        }
    }, [slug, user, fetchData]);

    const handleStartActivity = async () => {
        if (!activity) return;
        setActionLoading(true);
        try {
            await startActivity(activity.documentId);
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to start activity:', error);
            alert('Failed to start activity. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAsSubmitted = async () => {
        if (!activity) return;
        setActionLoading(true);
        try {
            await updateActivityStatus(activity.documentId, 'submitted');
            await fetchData();
        } catch (error) {
            console.error('Failed to submit activity:', error);
            alert('Failed to submit activity. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading activity...</p>
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Activity not found</h2>
                    <p className="text-gray-600 mb-4">The activity you're looking for doesn't exist or you don't have access.</p>
                    <Button onClick={() => router.push('/account/activities')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </Button>
                </div>
            </div>
        );
    }

    const isApproved = activity.activityStatus === 'approved';
    const isChangesRequested = activity.activityStatus === 'changes_requested';
    const isSubmitted = activity.activityStatus === 'submitted' || activity.activityStatus === 'under_review' || activity.activityStatus === 'reviewed';
    const canStart = activity.activityStatus === 'assigned';
    const canSubmit = activity.activityStatus === 'in_progress' || isChangesRequested;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push('/account/activities')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to My Activities
                </Button>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Due: {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'No deadline'}
                            </span>
                            {activity.category && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                    {activity.category.name}
                                </span>
                            )}
                            {activity.tags?.map((tag) => (
                                <span key={tag.slug} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Badge className={`text-sm px-4 py-2 ${getStatusColor(activity.activityStatus)} border-0`}>
                        {formatStatus(activity.activityStatus)}
                    </Badge>
                </div>

                {/* Quick Actions Bar */}
                <div className="mt-6 flex flex-wrap gap-3">
                    {canStart && (
                        <Button onClick={handleStartActivity} disabled={actionLoading}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Working
                        </Button>
                    )}
                    {isChangesRequested && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700 font-medium">Changes Requested - Please review feedback</span>
                        </div>
                    )}
                    {isApproved && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-700 font-medium">Approved! Great work!</span>
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="submission">Submission</TabsTrigger>
                    <TabsTrigger value="feedback" className="relative">
                        Feedback
                        {activity.feedbackThread && activity.feedbackThread.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                {activity.feedbackThread.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            {/* Instructions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Instructions</CardTitle>
                                </CardHeader>
                                <CardContent className="prose max-w-none">
                                    {activity.excerpt && (
                                        <p className="text-lg text-gray-700 mb-4">{activity.excerpt}</p>
                                    )}
                                    {activity.description ? (
                                        typeof activity.description === 'string' ? (
                                            <p>{activity.description}</p>
                                        ) : (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                {/* TODO: Use proper BlocksRenderer */}
                                                <p className="text-gray-600">
                                                    Detailed instructions available. Please review the rich content below.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">No detailed description provided.</p>
                                    )}
                                    {activity.goFromLink && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <p className="font-medium text-blue-900">Go From Link:</p>
                                            <a
                                                href={activity.goFromLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {activity.goFromLink}
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Resources */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Resources</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {activity.downloadables && activity.downloadables.length > 0 ? (
                                        activity.downloadables.map((file, i) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group border"
                                            >
                                                <div className="bg-blue-100 p-2 rounded mr-3 text-blue-600 group-hover:bg-blue-200">
                                                    <Download className="w-4 h-4" />
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">Click to download</p>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No resources attached.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Mentor/Review Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Review Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Mentor</p>
                                            <p className="text-sm mt-1">{activity.mentor?.username || 'Pending Assignment'}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Grade</p>
                                            <p className="text-3xl font-bold mt-1 text-gray-900">
                                                {activity.grade !== undefined && activity.grade !== null ? activity.grade : '--'}
                                                <span className="text-sm font-normal text-gray-500">/100</span>
                                            </p>
                                        </div>
                                        {activity.startDate && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Start Date</p>
                                                    <p className="text-sm mt-1">{new Date(activity.startDate).toLocaleDateString()}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Submission Tab */}
                <TabsContent value="submission" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Submission</CardTitle>
                            <CardDescription>
                                {isApproved
                                    ? 'Your submission has been approved.'
                                    : canSubmit
                                        ? 'Upload your work files below for review.'
                                        : isSubmitted
                                            ? 'Your submission is under review.'
                                            : 'Click "Start Working" to begin this activity.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isApproved ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
                                    <div>
                                        <p className="font-semibold text-green-900">Assignment Approved!</p>
                                        <p className="text-green-700">Great job. No further actions required.</p>
                                    </div>
                                </div>
                            ) : canSubmit ? (
                                <FileUpload
                                    activityId={activity.documentId}
                                    onUploadComplete={fetchData}
                                />
                            ) : isSubmitted ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-center">
                                    <Clock className="w-8 h-8 text-yellow-500 mr-4" />
                                    <div>
                                        <p className="font-semibold text-yellow-900">Submission Under Review</p>
                                        <p className="text-yellow-700">Your mentor will review your work and provide feedback.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="font-medium text-gray-900">Ready to start?</p>
                                    <p className="text-gray-600 mb-4">Click "Start Working" above to begin this activity.</p>
                                </div>
                            )}

                            {/* List existing submissions */}
                            {activity.submissionUploads && activity.submissionUploads.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                                    <div className="grid gap-2">
                                        {activity.submissionUploads.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                            >
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                                                    <span className="text-sm font-medium">{file.name}</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        View
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            {canSubmit && activity.submissionUploads && activity.submissionUploads.length > 0 && (
                                <div className="pt-4 border-t">
                                    <Button
                                        onClick={handleMarkAsSubmitted}
                                        disabled={actionLoading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Submit for Review
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Once submitted, your mentor will review your work.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Feedback & Discussion
                            </CardTitle>
                            <CardDescription>
                                Communicate with your mentor about this activity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FeedbackThread
                                activityId={activity.documentId}
                                feedbackThread={activity.feedbackThread}
                                currentUserRole="student"
                                currentUserName={user?.username || user?.email || 'Student'}
                                onFeedbackAdded={fetchData}
                                disabled={isApproved}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function getStatusColor(status: string) {
    const map: Record<string, string> = {
        assigned: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-purple-100 text-purple-800',
        reviewed: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        changes_requested: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string) {
    return status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
