'use client';

import { Event } from '@/lib/api/events';
import { useAuth } from '@/lib/contexts/auth-context';
import {
    EventHeader,
    EventCoverImage,
    EventAbout,
    EventSpeakers,
    EventAgenda,
    EventRegistration
} from './event-components';

import { checkAccess } from '@/components/auth/access-gate';

interface EventViewProps {
    readonly event: Event;
}

export function EventView({ event }: EventViewProps) {
    const { user } = useAuth();

    // Access Logic - matching blog-post-view.tsx
    const hasAccess = () => {
        if (!event) return false;
        return checkAccess(user, event.allowedTiers, event.allowedRoles);
    };

    const accessible = hasAccess();

    // Determine if it's a subscription-based restriction (for CTA text)
    const isSubscriptionRestricted = event.allowedTiers && event.allowedTiers.length > 0 && !event.allowedTiers.includes('FREE');

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            {/* Header / Hero */}
            <EventHeader
                event={event}
                accessible={accessible}
                isSubscriptionRestricted={!!isSubscriptionRestricted}
            />

            {/* Cover Image */}
            <EventCoverImage event={event} accessible={accessible} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* About Event */}
                    <EventAbout
                        event={event}
                        accessible={accessible}
                        isSubscriptionRestricted={!!isSubscriptionRestricted}
                        user={user}
                    />

                    {/* Speakers */}
                    <EventSpeakers event={event} accessible={accessible} />

                    {/* Agenda */}
                    <EventAgenda event={event} accessible={accessible} />
                </div>

                <div className="space-y-8">
                    {/* Organization & Registration */}
                    <EventRegistration
                        event={event}
                        accessible={accessible}
                        isSubscriptionRestricted={!!isSubscriptionRestricted}
                        user={user}
                    />
                </div>
            </div>
        </article>
    );
}

