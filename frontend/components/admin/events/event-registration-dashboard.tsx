'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getEventRegistrations,
    getRegistrationCounts,
    getEventAnalytics,
    exportAttendance,
    downloadExport,
    promoteFromWaitlist,
    demoteToWaitlist,
    markAttendance,
    bulkMarkAttendance,
    Registration,
    RegistrationCounts,
    EventAnalytics
} from '@/lib/api/admin/event-registrations';
import { RegistrationTable } from './registration-table';
import { RegistrationStats } from './registration-stats';
import { AnalyticsDashboard } from './analytics-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EventRegistrationDashboardProps {
    eventId: string;
    eventTitle: string;
}

export function EventRegistrationDashboard({ eventId, eventTitle }: EventRegistrationDashboardProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('registrations');
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [counts, setCounts] = useState<RegistrationCounts | null>(null);
    const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [regsData, countsData, analyticsData] = await Promise.all([
                getEventRegistrations(eventId, { pageSize: 1000 }), // Fetch all for now
                getRegistrationCounts(eventId),
                getEventAnalytics(eventId)
            ]);

            setRegistrations(regsData.data);
            setCounts(countsData);
            setAnalytics(analyticsData);
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId) {
            fetchData();
        }
    }, [eventId, fetchData]);

    const handleExport = async (format: 'csv' | 'xlsx') => {
        try {
            const blob = await exportAttendance(eventId, format);
            downloadExport(blob, eventTitle, format);
            toast({
                title: 'Export Successful',
                description: `Event attendance exported as ${format.toUpperCase()}`,
            });
        } catch (error) {
            toast({
                title: 'Export Failed',
                description: 'Could not export attendance data',
                variant: 'destructive'
            });
        }
    };

    const handlePromote = async (id: string) => {
        try {
            await promoteFromWaitlist(id);
            toast({ title: 'User Promoted', description: 'User has been moved to confirmed list' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Action Failed', description: error.message, variant: 'destructive' });
        }
    };

    const handleDemote = async (id: string) => {
        try {
            await demoteToWaitlist(id);
            toast({ title: 'User Demoted', description: 'User has been moved to waitlist' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Action Failed', description: error.message, variant: 'destructive' });
        }
    };

    const handleMarkAttended = async (id: string) => {
        try {
            await markAttendance(id);
            toast({ title: 'Attendance Marked', description: 'User marked as attended' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Action Failed', description: error.message, variant: 'destructive' });
        }
    };

    const handleBulkMarkAttended = async (ids: string[]) => {
        try {
            const result = await bulkMarkAttendance(ids);
            toast({ title: 'Bulk Action Successful', description: `Marked ${result.updated} users as attended` });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Action Failed', description: error.message, variant: 'destructive' });
        }
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Dashboard</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchData} variant="outline" className="bg-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{eventTitle}</h2>
                    <p className="text-gray-500">Manage registrations, waitlist, and attendance</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport('csv')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {counts && <RegistrationStats counts={counts} />}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="registrations">Registrations</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="registrations">
                    <RegistrationTable
                        registrations={registrations}
                        loading={loading}
                        onPromote={handlePromote}
                        onDemote={handleDemote}
                        onMarkAttended={handleMarkAttended}
                        onBulkMarkAttended={handleBulkMarkAttended}
                    />
                </TabsContent>

                <TabsContent value="analytics">
                    {analytics ? (
                        <AnalyticsDashboard analytics={analytics} />
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            Loading analytics...
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
