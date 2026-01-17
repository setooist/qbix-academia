'use client';

import { RegistrationCounts } from '@/lib/api/admin/event-registrations';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, XCircle, UserCheck } from 'lucide-react';

interface RegistrationStatsProps {
    counts: RegistrationCounts;
    eventTitle?: string;
}

export function RegistrationStats({ counts, eventTitle }: RegistrationStatsProps) {
    const stats = [
        {
            label: 'Confirmed',
            value: counts.confirmed,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: counts.capacity
                ? `${counts.confirmed} / ${counts.capacity} capacity`
                : 'No capacity limit'
        },
        {
            label: 'Waitlisted',
            value: counts.waitlisted,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            description: counts.waitlisted > 0
                ? `${counts.waitlisted} waiting for spots`
                : 'No waitlist'
        },
        {
            label: 'Attended',
            value: counts.attended,
            icon: UserCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: counts.confirmed + counts.attended > 0
                ? `${Math.round((counts.attended / (counts.confirmed + counts.attended)) * 100)}% attendance rate`
                : 'No attendees yet'
        },
        {
            label: 'Cancelled',
            value: counts.cancelled,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: counts.cancelled > 0
                ? `${counts.cancelled} cancellations`
                : 'No cancellations'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
