'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAssignmentBySlug, Assignment } from '@/lib/api/assignments';
import { startAssignment, updateAssignmentStatus } from '@/lib/api/assignment-mutations';
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
    const urlParams = useParams();
    const lang = urlParams?.lang || 'en';
    const { user, loading: authLoading } = useAuth();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
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
        const userId = user?.documentId || user?.id;
        if (slug && userId) {
            try {
                const data = await getAssignmentBySlug(slug, userId);
                setAssignment(data);
            } catch (error) {
                console.error("Failed to fetch assignment:", error);
            } finally {
                setLoading(false);
            }
        } else if (!user && !authLoading) {
            setLoading(false);
        }
    }, [slug, user, authLoading]);

    useEffect(() => {
        if (slug && user) {
            fetchData();
        }
    }, [slug, user, fetchData]);

    const handleStartActivity = async () => {
        if (!assignment) return;
        setActionLoading(true);
        try {
            await startAssignment(assignment.documentId);
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to start activity:', error);
            alert('Failed to start activity. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAsSubmitted = async () => {
        if (!assignment) return;
        setActionLoading(true);
        try {
            await updateAssignmentStatus(assignment.documentId, 'submitted');
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

    if (!assignment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Activity not found</h2>
                    <p className="text-gray-600 mb-4">The activity you're looking for doesn't exist or hasn't been assigned to you.</p>
                    <Button onClick={() => router.push(`/${lang}/account/activities`)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </Button>
                </div>
            </div>
        );
    }

    const isApproved = assignment.status === 'approved';
    const isChangesRequested = assignment.status === 'needs_changes';
    const isSubmitted = assignment.status === 'submitted' || assignment.status === 'under_review';
    const canStart = assignment.status === 'not_started';
    const canSubmit = assignment.status === 'in_progress' || isChangesRequested;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push(`/${lang}/account/activities`)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to My Activities
                </Button>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{assignment.activity?.title || 'Untitled Activity'}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}
                            </span>
                            {assignment.activity?.category && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                    {assignment.activity.category.name}
                                </span>
                            )}
                            {assignment.activity?.tags?.map((tag) => (
                                <span key={tag.slug} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Badge className={`text-sm px-4 py-2 ${getStatusColor(assignment.status)} border-0`}>
                        {formatStatus(assignment.status)}
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
                        {assignment.feedback && assignment.feedback.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                {assignment.feedback.length}
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
                                    {assignment.activity?.excerpt && (
                                        <p className="text-lg text-gray-700 mb-4">{assignment.activity.excerpt}</p>
                                    )}
                                    {assignment.activity?.description ? (
                                        typeof assignment.activity.description === 'string' ? (
                                            <p>{assignment.activity.description}</p>
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
                                    {assignment.activity?.goFromLink && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <p className="font-medium text-blue-900">Go From Link:</p>
                                            <a
                                                href={assignment.activity.goFromLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {assignment.activity.goFromLink}
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
                                    {assignment.activity?.downloadables && assignment.activity.downloadables.length > 0 ? (
                                        assignment.activity.downloadables.map((file, i) => (
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
                                            <p className="text-sm mt-1">{assignment.mentor?.username || assignment.activity?.mentor?.username || 'Pending Assignment'}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Grade</p>
                                            <p className="text-3xl font-bold mt-1 text-gray-900">
                                                {assignment.grade !== undefined && assignment.grade !== null ? assignment.grade : '--'}
                                                <span className="text-sm font-normal text-gray-500">/100</span>
                                            </p>
                                        </div>
                                        {/* Removed activity.startDate as it is not fetched and not on assignment */}
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
                                    assignmentId={assignment.documentId}
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
                            {assignment.submissionUploads && assignment.submissionUploads.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                                    <div className="grid gap-2">
                                        {assignment.submissionUploads.map((file, i) => (
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
                            {canSubmit && assignment.submissionUploads && assignment.submissionUploads.length > 0 && (
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
                                assignmentId={assignment.documentId}
                                feedbackThread={assignment.feedback}
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

function getStatusColor(status: string | null | undefined) {
    const map: Record<string, string> = {
        not_started: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        needs_changes: 'bg-red-100 text-red-800',
    };
    const safeStatus = status || 'not_started';
    return map[safeStatus] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string | null | undefined) {
    const safeStatus = status || 'not_started';
    return safeStatus.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
