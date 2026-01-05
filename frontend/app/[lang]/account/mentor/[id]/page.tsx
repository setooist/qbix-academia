'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getActivityById, Activity } from '@/lib/api/activities';
import { approveActivity, requestChanges, gradeActivity } from '@/lib/api/activity-mutations';
import { FeedbackThread } from '@/components/activities/feedback-thread';
import {
    ArrowLeft,
    User,
    Calendar,
    FileText,
    Download,
    CheckCircle,
    XCircle,
    MessageSquare,
    Star,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MentorReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentId, setDocumentId] = useState<string | null>(null);

    // Review Dialog State
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [grade, setGrade] = useState<string>('');
    const [approvalFeedback, setApprovalFeedback] = useState('');
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function resolveParams() {
            const p = await params;
            setDocumentId(p.id);
        }
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    const fetchData = useCallback(async () => {
        if (documentId) {
            const data = await getActivityById(documentId);
            setActivity(data);
            if (data?.grade) {
                setGrade(data.grade.toString());
            }
            setLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        if (documentId && user) {
            fetchData();
        }
    }, [documentId, user, fetchData]);

    const handleApprove = async () => {
        if (!activity) return;
        setActionLoading(true);
        try {
            const gradeValue = grade ? parseFloat(grade) : undefined;
            await approveActivity(activity.documentId, gradeValue, approvalFeedback);
            setShowApproveDialog(false);
            await fetchData();
        } catch (error) {
            console.error('Failed to approve:', error);
            alert('Failed to approve activity. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestChanges = async () => {
        if (!activity || !rejectionFeedback.trim()) return;
        setActionLoading(true);
        try {
            await requestChanges(activity.documentId, rejectionFeedback);
            setShowRejectDialog(false);
            await fetchData();
        } catch (error) {
            console.error('Failed to request changes:', error);
            alert('Failed to request changes. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveGrade = async () => {
        if (!activity || !grade) return;
        setActionLoading(true);
        try {
            await gradeActivity(activity.documentId, parseFloat(grade));
            await fetchData();
        } catch (error) {
            console.error('Failed to save grade:', error);
            alert('Failed to save grade. Please try again.');
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
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Activity not found</h2>
                    <Button onClick={() => router.push('/account/mentor')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const isApproved = activity.activityStatus === 'approved';
    const canReview = activity.activityStatus === 'submitted' || activity.activityStatus === 'under_review';
    const isChangesRequested = activity.activityStatus === 'changes_requested';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl space-y-8">
                {/* Header */}
                <div>
                    <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push('/account/mentor')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Mentor Dashboard
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    Student: {activity.assignee?.username || 'Unknown'}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'No deadline'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={activity.activityStatus} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions for Review */}
                {canReview && (
                    <Card className="border-2 border-yellow-200 bg-yellow-50">
                        <CardContent className="py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                    <div>
                                        <p className="font-semibold text-yellow-900">Submission Ready for Review</p>
                                        <p className="text-sm text-yellow-700">Review the student's work and provide feedback</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Request Changes
                                    </Button>
                                    <Button onClick={() => setShowApproveDialog(true)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isApproved && (
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardContent className="py-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-900">Activity Approved</p>
                                    <p className="text-sm text-green-700">
                                        Grade: {activity.grade ?? '-'}/100
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content */}
                <Tabs defaultValue="submission" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="submission">Submission</TabsTrigger>
                        <TabsTrigger value="details">Activity Details</TabsTrigger>
                        <TabsTrigger value="feedback" className="relative">
                            Feedback
                            {activity.feedbackThread && activity.feedbackThread.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                    {activity.feedbackThread.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Submission Tab */}
                    <TabsContent value="submission" className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Student Submission</CardTitle>
                                        <CardDescription>
                                            Files uploaded by {activity.assignee?.username || 'the student'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {activity.submissionUploads && activity.submissionUploads.length > 0 ? (
                                            <div className="space-y-3">
                                                {activity.submissionUploads.map((file, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-primary transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-blue-100 p-2 rounded text-blue-600">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{file.name}</p>
                                                                <p className="text-sm text-gray-500">Click to view/download</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" asChild>
                                                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                <Download className="w-4 h-4 mr-2" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                                <p>No submission files uploaded yet.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                            Grading
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="grade">Grade (0-100)</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    id="grade"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    placeholder="Enter grade"
                                                />
                                                <Button
                                                    variant="outline"
                                                    onClick={handleSaveGrade}
                                                    disabled={actionLoading || !grade}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="text-center">
                                            <p className="text-4xl font-bold text-gray-900">
                                                {activity.grade ?? '--'}
                                            </p>
                                            <p className="text-gray-500">Current Grade</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Activity Instructions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose max-w-none">
                                        {activity.excerpt && (
                                            <p className="text-lg text-gray-700 mb-4">{activity.excerpt}</p>
                                        )}
                                        {activity.description ? (
                                            typeof activity.description === 'string' ? (
                                                <p>{activity.description}</p>
                                            ) : (
                                                <div className="bg-gray-50 p-4 rounded">
                                                    <p className="text-gray-600">Rich content available</p>
                                                </div>
                                            )
                                        ) : (
                                            <p className="text-gray-500 italic">No description provided.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resources</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {activity.downloadables && activity.downloadables.length > 0 ? (
                                            <div className="space-y-2">
                                                {activity.downloadables.map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-2 rounded hover:bg-gray-100"
                                                    >
                                                        <Download className="w-4 h-4 mr-2 text-blue-500" />
                                                        <span className="text-sm truncate">{file.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No resources attached.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Feedback Tab */}
                    <TabsContent value="feedback">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Feedback Thread
                                </CardTitle>
                                <CardDescription>
                                    Communication history with the student
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FeedbackThread
                                    activityId={activity.documentId}
                                    feedbackThread={activity.feedbackThread}
                                    currentUserRole="mentor"
                                    currentUserName={user?.username || user?.email || 'Mentor'}
                                    onFeedbackAdded={fetchData}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Approve Dialog */}
                <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approve Submission</DialogTitle>
                            <DialogDescription>
                                Approve the student's work and optionally add feedback.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="approveGrade">Final Grade (0-100)</Label>
                                <Input
                                    id="approveGrade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    placeholder="Enter final grade"
                                />
                            </div>
                            <div>
                                <Label htmlFor="approveFeedback">Feedback (Optional)</Label>
                                <Textarea
                                    id="approveFeedback"
                                    value={approvalFeedback}
                                    onChange={(e) => setApprovalFeedback(e.target.value)}
                                    placeholder="Great work! Here are some additional thoughts..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleApprove} disabled={actionLoading}>
                                {actionLoading ? 'Approving...' : 'Approve Submission'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Request Changes Dialog */}
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Changes</DialogTitle>
                            <DialogDescription>
                                Provide feedback on what the student needs to improve.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="rejectFeedback">Required Changes *</Label>
                                <Textarea
                                    id="rejectFeedback"
                                    value={rejectionFeedback}
                                    onChange={(e) => setRejectionFeedback(e.target.value)}
                                    placeholder="Please describe what needs to be changed or improved..."
                                    rows={5}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleRequestChanges}
                                disabled={actionLoading || !rejectionFeedback.trim()}
                            >
                                {actionLoading ? 'Sending...' : 'Request Changes'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        assigned: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-purple-100 text-purple-800',
        reviewed: 'bg-indigo-100 text-indigo-800',
        approved: 'bg-green-100 text-green-800',
        changes_requested: 'bg-red-100 text-red-800',
    };
    const label = status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <Badge className={`${styles[status] || 'bg-gray-100'} border-0 text-sm px-3 py-1`}>
            {label}
        </Badge>
    );
}
