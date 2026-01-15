'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/api/events';
import { getStrapiMedia } from '@/lib/strapi/client';
import { Calendar, MapPin, Monitor, Lock, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/lib/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { checkAccess } from '@/components/auth/access-gate';

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
        return checkAccess(user, event.allowedTiers, event.allowedRoles);
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

                    const badges = [];
                    if (event.eventType) {
                        badges.push(<Badge key="type" className="bg-primary">{event.eventType}</Badge>);
                    }
                    if (!accessible) {
                        badges.push(<Badge key="access" variant="destructive" className="ml-auto">Member Only</Badge>);
                    }

                    const meta = (
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {format(startDate, 'MMM d, yyyy • h:mm a')}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                {event.locationType === 'Online' ? (
                                    <>
                                        <Monitor className="w-4 h-4" />
                                        <span>Online</span>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate max-w-[150px]">{event.locationType}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );

                    const action = accessible ? null : (
                        <div className="flex items-center gap-2 text-gray-400 font-medium mt-2">
                            <Lock className="w-4 h-4" />
                            <span>Locked Content</span>
                        </div>
                    );

                    return (
                        <ContentCard
                            key={event.documentId}
                            title={event.title}
                            description={event.excerpt || ''}
                            imageSrc={imageUrl || ''}
                            imageAlt={event.coverImage?.alternativeText || event.title}
                            imageUnoptimized={isLocalImage}
                            badges={badges}
                            meta={meta}
                            action={action}
                            isLocked={!accessible}
                            href={`/events/${event.slug}`}
                            onClick={(e) => handleCardClick(e, accessible)}
                        />
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
