'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getActivityById, Activity } from '@/lib/api/activities';
import { updateActivityStatus, getUsers } from '@/lib/api/activity-mutations';
import { FeedbackThread } from '@/components/activities/feedback-thread';
import {
    ArrowLeft,
    User,
    Calendar,
    FileText,
    Download,
    CheckCircle,
    Clock,
    AlertTriangle,
    Edit,
    Save,
    MessageSquare,
    Loader2,
    Eye
} from 'lucide-react';

interface UserOption {
    id: string;
    username: string;
    email: string;
}

export default function ActivityDetailsAdmin({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { hasPermission, isAdmin, loading: permsLoading } = usePermissions();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [actionLoading, setActionLoading] = useState(false);

    // Edit mode
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        assigneeId: '',
        mentorId: '',
        status: '',
        dueDate: '',
    });

    useEffect(() => {
        async function resolveParams() {
            const resolvedParams = await params;
            setDocumentId(resolvedParams.id);
        }
        resolveParams();
    }, [params]);

    const fetchData = useCallback(async () => {
        if (!documentId) return;
        try {
            const [activityData, usersData] = await Promise.all([
                getActivityById(documentId),
                getUsers().catch(() => []),
            ]);
            setActivity(activityData);
            setUsers(Array.isArray(usersData) ? usersData : []);

            if (activityData) {
                setEditData({
                    assigneeId: activityData.assignee?.username || '',
                    mentorId: activityData.mentor?.username || '',
                    status: activityData.activityStatus,
                    dueDate: activityData.dueDate ? new Date(activityData.dueDate).toISOString().slice(0, 16) : '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        if (documentId) {
            fetchData();
        }
    }, [documentId, fetchData]);

    const handleStatusChange = async (newStatus: string) => {
        if (!activity) return;
        setActionLoading(true);
        try {
            await updateActivityStatus(activity.documentId, newStatus as any);
            await fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || permsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
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
                    <Button onClick={() => router.push('/admin/activities')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </Button>
                </div>
            </div>
        );
    }

    const statusOptions = [
        { value: 'assigned', label: 'Assigned' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'approved', label: 'Approved' },
        { value: 'changes_requested', label: 'Changes Requested' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl space-y-8">
                {/* Header */}
                <div>
                    <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push('/admin/activities')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
                            <p className="text-gray-500 mt-1">{activity.slug}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {activity.assignee?.username || 'Unassigned'}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'No deadline'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={activity.activityStatus} size="lg" />
                            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Status Change */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Quick Status Change</p>
                                <p className="text-sm text-gray-500">Update the activity status</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Select
                                    value={activity.activityStatus}
                                    onValueChange={handleStatusChange}
                                    disabled={actionLoading}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {actionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
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
                        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Activity Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {activity.excerpt && (
                                            <div>
                                                <Label className="text-gray-500">Summary</Label>
                                                <p className="mt-1">{activity.excerpt}</p>
                                            </div>
                                        )}
                                        {activity.description && (
                                            <div>
                                                <Label className="text-gray-500">Description</Label>
                                                <div className="mt-1 prose max-w-none bg-gray-50 p-4 rounded">
                                                    {typeof activity.description === 'string'
                                                        ? activity.description
                                                        : 'Rich content'}
                                                </div>
                                            </div>
                                        )}
                                        {activity.goFromLink && (
                                            <div>
                                                <Label className="text-gray-500">Reference Link</Label>
                                                <a
                                                    href={activity.goFromLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block mt-1 text-blue-600 hover:underline"
                                                >
                                                    {activity.goFromLink}
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

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
                                                        className="flex items-center p-3 rounded-lg border hover:bg-gray-50"
                                                    >
                                                        <Download className="w-5 h-5 mr-3 text-blue-500" />
                                                        <span>{file.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No resources attached.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Assignment Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-gray-500">Student</Label>
                                            <p className="mt-1 font-medium">{activity.assignee?.username || 'Unassigned'}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="text-gray-500">Mentor</Label>
                                            <p className="mt-1 font-medium">{activity.mentor?.username || 'Unassigned'}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="text-gray-500">Category</Label>
                                            <p className="mt-1">{activity.category?.name || 'None'}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="text-gray-500">Grade</Label>
                                            <p className="mt-1 text-2xl font-bold">
                                                {activity.grade ?? '--'}<span className="text-sm font-normal text-gray-500">/100</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {activity.startDate && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Start Date</span>
                                                <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Due Date</span>
                                            <span>{activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : '-'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Submission Tab */}
                    <TabsContent value="submission">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Submission</CardTitle>
                                <CardDescription>
                                    Files uploaded by the student
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activity.submissionUploads && activity.submissionUploads.length > 0 ? (
                                    <div className="space-y-3">
                                        {activity.submissionUploads.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-6 h-6 text-blue-500" />
                                                    <span className="font-medium">{file.name}</span>
                                                </div>
                                                <Button variant="outline" asChild>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p>No submissions yet.</p>
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
                                    Feedback Thread
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FeedbackThread
                                    activityId={activity.documentId}
                                    feedbackThread={activity.feedbackThread}
                                    currentUserRole="admin"
                                    currentUserName="Admin"
                                    onFeedbackAdded={fetchData}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Audit Trail Tab */}
                    <TabsContent value="audit">
                        <Card>
                            <CardHeader>
                                <CardTitle>Audit Trail</CardTitle>
                                <CardDescription>
                                    History of changes and actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activity.auditTrail && Array.isArray(activity.auditTrail) && activity.auditTrail.length > 0 ? (
                                    <div className="space-y-3">
                                        {activity.auditTrail.map((entry: any, i: number) => (
                                            <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded border">
                                                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{entry.action || 'Action'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown time'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p>No audit trail recorded.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'lg' }) {
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
    const sizeClass = size === 'lg' ? 'text-sm px-4 py-2' : 'text-xs px-3 py-1';
    return (
        <Badge className={`${styles[status] || 'bg-gray-100'} border-0 ${sizeClass}`}>
            {label}
        </Badge>
    );
}
