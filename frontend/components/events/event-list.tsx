'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/api/events';
import { getStrapiMedia } from '@/lib/strapi/client';
import { Calendar, MapPin, Monitor, Lock, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/lib/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

function checkTierAccess(user: any, allowedTiers: string[]) {
    // If 'FREE' is allowed, everyone has access
    if (allowedTiers.includes('FREE')) return true;

    if (!user) return false;

    // Check if user is Mentor (Always has access)
    const userRoleName = user.role?.name?.toLowerCase();
    const userRoleType = user.role?.type?.toLowerCase();
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    // Check user tier
    const userTier = user.tier || 'FREE';
    if (allowedTiers.includes(userTier)) return true;

    // Also check if user has an active subscription (in case tier wasn't updated)
    if (allowedTiers.includes('SUBSCRIPTION')) {
        // Check subscriptionActive flag
        if (user.subscriptionActive === true) return true;

        // Check subscriptions relation for any active subscription
        const activeSubscription = user.subscriptions?.some(
            (sub: any) => sub.subscription_status === 'active'
        );
        if (activeSubscription) return true;
    }

    return false;
}

function checkRoleAccess(user: any, allowedRoles: any[]) {
    if (allowedRoles.length === 0) return true;

    const isPubliclyAllowed = allowedRoles.some(
        (r: any) => r.type === 'public' || r.name.toLowerCase() === 'public'
    );
    if (isPubliclyAllowed) return true;

    if (!user) return false;

    const userRoleType = user.role?.type?.toLowerCase();
    const userRoleName = user.role?.name?.toLowerCase();

    // Also allow Mentors via role check fallback
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    return allowedRoles.some((r: any) =>
        (r.type && r.type.toLowerCase() === userRoleType) ||
        (r.name && r.name.toLowerCase() === userRoleName)
    );
}

interface EventListProps {
    readonly events: readonly Event[];
}

export function EventList({ events }: EventListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No upcoming events scheduled at the moment.</p>
            </div>
        );
    }

    const hasAccess = (event: Event) => {
        if (!event) return false;

        // Check Tiers (Primary Check)
        const allowedTiers = event.allowedTiers;
        if (allowedTiers && allowedTiers.length > 0) {
            return checkTierAccess(user, allowedTiers);
        }

        // Fallback to Roles check (Original Logic)
        const allowedRoles = event.allowedRoles || [];
        return checkRoleAccess(user, allowedRoles);
    };

    const handleCardClick = (e: React.MouseEvent, accessible: boolean) => {
        if (!accessible) {
            e.preventDefault();
            if (user) {
                setShowSubscriptionModal(true);
            } else {
                setShowLoginModal(true);
            }
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => {
                    const imageUrl = event.coverImage ? getStrapiMedia(event.coverImage.url) : null;
                    const startDate = new Date(event.startDateTime);
                    const accessible = hasAccess(event);
                    const isLocalImage = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

                    const LinkWrapper = accessible ? Link : 'div';
                    const linkProps = accessible ? { href: `/events/${event.slug}` } : {};

                    return (
                        // @ts-ignore
                        <LinkWrapper
                            key={event.documentId}
                            {...linkProps}
                            className={`group flex flex-col rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full relative cursor-pointer ${accessible ? 'bg-white hover:shadow-md transition-shadow' : 'bg-gray-50 opacity-90'}`}
                            onClick={(e: React.MouseEvent) => handleCardClick(e, accessible)}
                        >
                            <div className="relative h-48 w-full bg-gray-100">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={event.coverImage?.alternativeText || event.title}
                                        fill
                                        unoptimized={isLocalImage}
                                        className={`object-cover transition-transform duration-300 ${accessible ? 'group-hover:scale-105' : 'grayscale blur-[2px]'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                        <Calendar className="w-12 h-12 opacity-50" />
                                    </div>
                                )}

                                {/* Lock Overlay */}
                                {!accessible && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] z-10">
                                        <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                            <Lock className="w-6 h-6 text-gray-700" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4 flex gap-2 z-20">
                                    <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-sm">
                                        {event.eventType}
                                    </span>
                                    {!accessible && (
                                        <Badge variant="destructive" className="flex items-center gap-1">
                                            Member Only
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-2 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        <span>{format(startDate, 'MMM d, yyyy • h:mm a')}</span>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-bold mb-2 transition-colors line-clamp-2 ${accessible ? 'text-gray-900 group-hover:text-primary' : 'text-gray-600'}`}>
                                    {event.title}
                                </h3>

                                {event.excerpt && (
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                                        {event.excerpt}
                                    </p>
                                )}

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500 justify-between">
                                    {event.locationType === 'Online' ? (
                                        <div className="flex items-center">
                                            <Monitor className="w-4 h-4 mr-1.5" />
                                            <span>Online</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5" />
                                            <span className="truncate max-w-[150px]">{event.locationType}</span>
                                        </div>
                                    )}

                                    {!accessible && (
                                        <div className="flex items-center text-gray-400 font-medium">
                                            <Lock className="w-4 h-4 mr-1" />
                                            <span>Locked</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </LinkWrapper>
                    );
                })}
            </div>

            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                        <DialogDescription>
                            Please log in to access this content.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push('/auth/login')}>
                            Login
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subscription Modal */}
            <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <DialogTitle>Premium Content</DialogTitle>
                        </div>
                        <DialogDescription>
                            This event is exclusive to premium members. Upgrade your plan to unlock full access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowSubscriptionModal(false)}>
                            Maybe Later
                        </Button>
                        <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0" onClick={() => router.push('/account/subscription')}>
                            Upgrade Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
