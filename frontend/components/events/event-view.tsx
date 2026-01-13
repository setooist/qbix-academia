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

interface EventViewProps {
    readonly event: Event;
}

export function EventView({ event }: EventViewProps) {
    const { user } = useAuth();

    // Access Logic - matching blog-post-view.tsx
    const hasAccess = () => {
        if (!event) return false;

        // Check Tiers (Primary Check)
        if (event.allowedTiers && event.allowedTiers.length > 0) {
            return checkTierAccess(user, event.allowedTiers);
        }

        // Fallback to Roles check (Original Logic)
        return checkRoleAccess(user, event.allowedRoles || []);
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

function checkTierAccess(user: any, allowedTiers: string[]) {
    // If 'FREE' is allowed, everyone has access
    if (allowedTiers.includes('FREE')) return true;

    if (!user) return false;

    // Check if user is Mentor (Always has access)
    if (isMentor(user)) return true;

    // Check user tier
    const userTier = user.tier || 'FREE';
    if (allowedTiers.includes(userTier)) return true;

    // Also check if user has an active subscription (in case tier wasn't updated)
    if (allowedTiers.includes('SUBSCRIPTION')) {
        return hasActiveSubscription(user);
    }

    return false;
}

function checkRoleAccess(user: any, allowedRoles: any[]) {
    if (allowedRoles.length === 0) return true;

    const isPubliclyAllowed = allowedRoles.some(
        (r: any) => r.type === 'public' || r.name?.toLowerCase() === 'public'
    );
    if (isPubliclyAllowed) return true;

    if (!user) return false;

    // Also allow Mentors via role check fallback
    if (isMentor(user)) return true;

    const userRoleType = user.role?.type?.toLowerCase();
    const userRoleName = user.role?.name?.toLowerCase();

    return allowedRoles.some((r: any) =>
        (r.type && r.type.toLowerCase() === userRoleType) ||
        (r.name && r.name.toLowerCase() === userRoleName)
    );
}

function isMentor(user: any) {
    const userRoleName = user.role?.name?.toLowerCase();
    const userRoleType = user.role?.type?.toLowerCase();
    return userRoleName === 'mentor' || userRoleType === 'mentor';
}

function hasActiveSubscription(user: any) {
    // Check subscriptionActive flag
    if (user.subscriptionActive === true) return true;

    // Check subscriptions relation for any active subscription
    const activeSubscription = user.subscriptions?.some(
        (sub: any) => sub.subscription_status === 'active'
    );
    if (activeSubscription) return true;
    return false;
}

