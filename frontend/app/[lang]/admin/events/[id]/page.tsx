'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Download,
    RefreshCw,
    Users,
    Clock,
    UserCheck,
    BarChart3
} from 'lucide-react';
import { RegistrationTable } from '@/components/admin/events/registration-table';
import { RegistrationStats } from '@/components/admin/events/registration-stats';
import { AnalyticsDashboard } from '@/components/admin/events/analytics-dashboard';
import {
    getEventRegistrations,
    getRegistrationCounts,
    getEventAnalytics,
    promoteFromWaitlist,
    demoteToWaitlist,
    markAttendance,
    bulkMarkAttendance,
    exportAttendance,
    downloadExport,
    Registration,
    RegistrationCounts,
    EventAnalytics
} from '@/lib/api/admin/event-registrations';

import { getAdminEvent, AdminEvent } from '@/lib/api/admin/events';

// ... (imports remain)

export default function EventManagementPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const { isEventManager, loading: permLoading } = usePermissions();

    // State
    const [event, setEvent] = useState<AdminEvent | null>(null); // Use AdminEvent
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [counts, setCounts] = useState<RegistrationCounts | null>(null);
    const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [activeTab, setActiveTab] = useState('registrations');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Fetch event details
    const fetchEventDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem('strapi_jwt');
            if (token) {
                const data = await getAdminEvent(eventId, token);
                setEvent(data);
            }
        } catch (error) {
            console.error('Failed to fetch event:', error);
        }
    }, [eventId]);

    // Fetch registrations
    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            const [regsData, countsData] = await Promise.all([
                getEventRegistrations(eventId, {
                    status: statusFilter as any || undefined,
                    pageSize: 100
                }),
                getRegistrationCounts(eventId)
            ]);
            setRegistrations(regsData.data || []);
            setCounts(countsData);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId, statusFilter]);

    // Fetch analytics
    const fetchAnalytics = useCallback(async () => {
        try {
            const data = await getEventAnalytics(eventId);
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    }, [eventId]);

    // Initial load
    useEffect(() => {
        if (!permLoading && !isEventManager()) {
            router.push('/');
            return;
        }

        if (eventId) {
            fetchEventDetails();
            fetchRegistrations();
        }
    }, [eventId, permLoading, isEventManager, router, fetchEventDetails, fetchRegistrations]);

    // Load analytics when switching to analytics tab
    useEffect(() => {
        if (activeTab === 'analytics' && !analytics) {
            fetchAnalytics();
        }
    }, [activeTab, analytics, fetchAnalytics]);

    // Action handlers
    const handlePromote = async (id: string) => {
        await promoteFromWaitlist(id);
        fetchRegistrations();
    };

    const handleDemote = async (id: string) => {
        await demoteToWaitlist(id);
        fetchRegistrations();
    };

    const handleMarkAttended = async (id: string) => {
        await markAttendance(id);
        fetchRegistrations();
    };

    const handleBulkMarkAttended = async (ids: string[]) => {
        await bulkMarkAttendance(ids);
        fetchRegistrations();
    };

    const handleExport = async (format: 'csv' | 'xlsx') => {
        setExporting(true);
        try {
            const blob = await exportAttendance(eventId, format);
            downloadExport(blob, event?.title || 'event', format);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleRefresh = () => {
        fetchRegistrations();
        if (analytics) {
            fetchAnalytics();
        }
    };

    // Filter registrations by status
    const filteredRegistrations = statusFilter
        ? registrations.filter(r => r.registration_status === statusFilter)
        : registrations;

    // Loading state
    if (permLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {event?.title || 'Event Registrations'}
                            </h1>
                            {event?.startDateTime && (
                                <p className="text-gray-500 mt-1">
                                    {new Date(event.startDateTime).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('csv')}
                                disabled={exporting}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('xlsx')}
                                disabled={exporting}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {counts && (
                    <div className="mb-6">
                        <RegistrationStats counts={counts} eventTitle={event?.title} />
                    </div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="registrations" className="gap-2">
                            <Users className="w-4 h-4" />
                            All Registrations
                        </TabsTrigger>
                        <TabsTrigger value="waitlist" className="gap-2">
                            <Clock className="w-4 h-4" />
                            Waitlist
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="gap-2">
                            <UserCheck className="w-4 h-4" />
                            Attendance
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* All Registrations */}
                    <TabsContent value="registrations">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <CardTitle>All Registrations</CardTitle>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={statusFilter === null ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter(null)}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter('confirmed')}
                                        >
                                            Confirmed
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'waitlisted' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter('waitlisted')}
                                        >
                                            Waitlisted
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'attended' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter('attended')}
                                        >
                                            Attended
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter('cancelled')}
                                        >
                                            Cancelled
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <RegistrationTable
                                    registrations={filteredRegistrations}
                                    onPromote={handlePromote}
                                    onDemote={handleDemote}
                                    onMarkAttended={handleMarkAttended}
                                    onBulkMarkAttended={handleBulkMarkAttended}
                                    loading={loading}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Waitlist */}
                    <TabsContent value="waitlist">
                        <Card>
                            <CardHeader>
                                <CardTitle>Waitlist Management</CardTitle>
                                <p className="text-sm text-gray-500">
                                    Users waiting for available spots. Promote to move to confirmed.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <RegistrationTable
                                    registrations={registrations.filter(r => r.registration_status === 'waitlisted')}
                                    onPromote={handlePromote}
                                    loading={loading}
                                    showBulkActions={false}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attendance */}
                    <TabsContent value="attendance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Tracking</CardTitle>
                                <p className="text-sm text-gray-500">
                                    Mark confirmed registrations as attended. Use bulk actions for multiple users.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <RegistrationTable
                                    registrations={registrations.filter(
                                        r => r.registration_status === 'confirmed' || r.registration_status === 'attended'
                                    )}
                                    onMarkAttended={handleMarkAttended}
                                    onBulkMarkAttended={handleBulkMarkAttended}
                                    loading={loading}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics */}
                    <TabsContent value="analytics">
                        {analytics ? (
                            <AnalyticsDashboard
                                analytics={analytics}
                                eventTitle={event?.title}
                            />
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-4 text-gray-500">Loading analytics...</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
