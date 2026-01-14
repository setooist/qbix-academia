'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/api/events';
import { getStrapiMedia } from '@/lib/strapi/client';
import { Calendar, MapPin, Monitor, Lock } from 'lucide-react';
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

interface EventListProps {
    events: Event[];
}

export function EventList({ events }: EventListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No upcoming events scheduled at the moment.</p>
            </div>
        );
    }

    const handleCardClick = (e: React.MouseEvent, accessible: boolean) => {
        if (!accessible) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => {
                    const imageUrl = event.coverImage ? getStrapiMedia(event.coverImage.url) : null;
                    const startDate = new Date(event.startDateTime);

                    // Check Access
                    const allowedRoles = event.allowedRoles || [];
                    const isPublic = allowedRoles.length === 0 || allowedRoles.some(r => r.type === 'public' || (r.name && r.name.toLowerCase() === 'public'));
                    const userHasAccess = user && allowedRoles.some(r => r.type === user.role?.type || (user.role?.name && r.name === user.role.name));
                    const accessible = Boolean(isPublic || userHasAccess);

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
        </>
    );
}
