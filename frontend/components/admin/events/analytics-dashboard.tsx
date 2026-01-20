'use client';

import { EventAnalytics } from '@/lib/api/admin/event-registrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';

interface AnalyticsDashboardProps {
    analytics: EventAnalytics;
    eventTitle?: string;
}

export function AnalyticsDashboard({ analytics, eventTitle }: AnalyticsDashboardProps) {
    const { summary, byRole, byTier, waitlistMetrics, timeTrends } = analytics;

    // Convert timeTrends to sorted array for chart
    const trendData = Object.entries(timeTrends)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14); // Last 14 days

    const maxTrend = Math.max(...trendData.map(([, v]) => v), 1);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Registrations"
                    value={summary.totalRegistrations}
                    icon={Users}
                    description={`${summary.confirmed + summary.attended} confirmed / ${summary.waitlisted} waitlisted`}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
                <SummaryCard
                    title="Capacity Utilization"
                    value={summary.capacityUtilization !== null ? `${summary.capacityUtilization}%` : 'N/A'}
                    icon={BarChart3}
                    description={summary.capacity ? `${summary.capacity} total capacity` : 'Unlimited'}
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                    progress={summary.capacityUtilization || 0}
                />
                <SummaryCard
                    title="Attendance Rate"
                    value={`${summary.attendanceRate}%`}
                    icon={TrendingUp}
                    description={`${summary.attended} attended of ${summary.confirmed + summary.attended} confirmed`}
                    iconColor="text-green-600"
                    iconBg="bg-green-50"
                    progress={summary.attendanceRate}
                />
                <SummaryCard
                    title="Drop-off Rate"
                    value={`${summary.dropOffRate}%`}
                    icon={Clock}
                    description={`${summary.cancelled} cancellations`}
                    iconColor="text-red-600"
                    iconBg="bg-red-50"
                    progress={summary.dropOffRate}
                    progressColor="bg-red-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration by Role */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Registrations by Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(byRole).length > 0 ? (
                                Object.entries(byRole).map(([role, count]) => {
                                    const percentage = Math.round((count / summary.totalRegistrations) * 100);
                                    return (
                                        <div key={role} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{role}</span>
                                                <span className="text-gray-500">{count} ({percentage}%)</span>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Registration by Tier */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Registrations by Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(byTier).length > 0 ? (
                                Object.entries(byTier).map(([tier, count]) => {
                                    const percentage = Math.round((count / summary.totalRegistrations) * 100);
                                    const tierColors: Record<string, string> = {
                                        FREE: 'bg-gray-500',
                                        BASIC: 'bg-blue-500',
                                        PRO: 'bg-purple-500',
                                        PREMIUM: 'bg-amber-500',
                                        ENTERPRISE: 'bg-emerald-500'
                                    };
                                    return (
                                        <div key={tier} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{tier}</span>
                                                <span className="text-gray-500">{count} ({percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${tierColors[tier] || 'bg-blue-500'} rounded-full transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Time Trends */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Registration Trend (Last 14 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    {trendData.length > 0 ? (
                        <div className="h-40 flex items-end gap-1">
                            {trendData.map(([date, count]) => (
                                <div
                                    key={date}
                                    className="flex-1 flex flex-col items-center group"
                                >
                                    <div className="relative w-full">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                                            style={{
                                                height: `${Math.max((count / maxTrend) * 120, 4)}px`
                                            }}
                                        />
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {count} registrations
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 rotate-45 origin-left">
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No trend data available</p>
                    )}
                </CardContent>
            </Card>

            {/* Waitlist Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Waitlist Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-sm text-orange-600 font-medium">Avg. Promotion Time</p>
                            <p className="text-2xl font-bold text-orange-700 mt-1">
                                {waitlistMetrics.averagePromotionTime !== null
                                    ? `${waitlistMetrics.averagePromotionTime} hours`
                                    : 'N/A'}
                            </p>
                            <p className="text-xs text-orange-500 mt-1">
                                Time from waitlist to confirmed
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Promotion Rate</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">
                                {waitlistMetrics.promotionRate}%
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                                Waitlisted users who got confirmed
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    iconColor: string;
    iconBg: string;
    progress?: number;
    progressColor?: string;
}

function SummaryCard({
    title,
    value,
    icon: Icon,
    description,
    iconColor,
    iconBg,
    progress,
    progressColor = 'bg-primary'
}: SummaryCardProps) {
    return (
        <Card className="border-2">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{description}</p>
                        {progress !== undefined && (
                            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${progressColor} rounded-full transition-all`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                    <div className={`p-2 rounded-lg ${iconBg}`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
