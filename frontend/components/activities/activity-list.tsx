'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Activity } from '@/lib/api/activities';
import { useAuth } from '@/lib/contexts/auth-context';

interface ActivityListProps {
    activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
    const { user } = useAuth();
    console.log('ActivityList: Activities received:', activities);

    const hasAccess = (activity: Activity) => {
        if (!activity) return false;

        // If the API returns no role information (undefined), we default to "Authenticated Users Only".
        // This ensures unauthenticated users see a Lock, stopping the "accessible if not login" issue.
        if (!activity.allowedRoles) return !!user;

        // If explicitly empty array, it might be intentionally public. 
        if (activity.allowedRoles.length === 0) return true;

        const isPubliclyAllowed = activity.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;

        if (!user) return false;

        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();

        return activity.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };

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
        return status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown';
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => {
                const accessible = hasAccess(activity);
                const LinkWrapper = accessible ? Link : 'div';
                const linkProps = accessible ? { href: `/activities/${activity.slug}` } : {};

                return (
                    // @ts-ignore
                    <LinkWrapper key={activity.documentId} {...linkProps} className="block h-full">
                        <Card className={accessible
                            ? "h-full border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                            : "h-full border-2 border-gray-200 bg-gray-50 opacity-80"
                        }>
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                                {/* Placeholder Image for Activity if none exists */}
                                <div className="text-gray-300">
                                    <Clock className="w-16 h-16 opacity-50" />
                                </div>

                                {/* Lock Overlay */}
                                {!accessible && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-10">
                                        <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                            <Lock className="w-6 h-6 text-gray-700" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <CardHeader>
                                <div className="flex items-center gap-2 mb-3">
                                    {activity.category && <Badge variant="secondary">{activity.category.name}</Badge>}
                                    <Badge variant="outline" className={`${getStatusColor(activity.activityStatus)} border-none`}>
                                        {formatStatus(activity.activityStatus)}
                                    </Badge>
                                    {!accessible && <Badge variant="destructive" className="ml-auto">Member Only</Badge>}
                                </div>
                                <CardTitle className={`line-clamp-2 ${accessible ? 'group-hover:text-primary transition-colors duration-300' : 'text-gray-600'}`}>
                                    {activity.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {/* If description is string, show it, else show a static placeholder */}
                                    {(typeof activity.description === 'string' && activity.description)
                                        ? activity.description
                                        : 'View details for full description and tasks.'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-auto">
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    {activity.dueDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(activity.dueDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    )}
                                    {activity.assignee && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {activity.assignee.username}
                                        </div>
                                    )}
                                </div>

                                {accessible ? (
                                    <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                                        View Details
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-400 font-medium">
                                        <Lock className="w-4 h-4" />
                                        <span>Locked Content</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </LinkWrapper>
                );
            })}
        </div>
    );
}
