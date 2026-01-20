import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, ExternalLink, Video, Users, Info, Lock, Crown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Event } from '@/lib/api/events';
import { getStrapiMedia } from '@/lib/strapi/client';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CommonEventProps {
    readonly event: Event;
}

interface AccessibleEventProps extends CommonEventProps {
    readonly accessible: boolean;
    readonly isSubscriptionRestricted: boolean;
}

interface UserEventProps extends AccessibleEventProps {
    readonly user: any;
}

function OnlineLocation({ event, accessible }: { readonly event: Event; readonly accessible: boolean }) {
    if (accessible && event.meetingLink) {
        return (
            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm inline-flex items-center">
                Join Meeting <ExternalLink className="w-3 h-3 ml-1" />
            </a>
        );
    }
    return (
        <span className="text-sm italic text-gray-500">
            {accessible ? 'Link available shortly' : 'Link available for members'}
        </span>
    );
}

export function EventHeader({ event, accessible, isSubscriptionRestricted }: AccessibleEventProps) {
    const startDate = new Date(event.startDateTime);
    const endDate = event.endDateTime ? new Date(event.endDateTime) : null;

    return (
        <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {event.eventType}
                </Badge>
                {event.category && (
                    <Badge variant="outline">
                        {event.category.name}
                    </Badge>
                )}
                {!accessible && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only'}
                    </Badge>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {event.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                    <div>
                        <p className="font-semibold text-gray-900">Date & Time</p>
                        <p>{format(startDate, 'EEEE, MMMM d, yyyy')}</p>
                        <p className="text-sm">
                            {format(startDate, 'h:mm a')}
                            {endDate && ` - ${format(endDate, 'h:mm a')}`}
                            {event.timezone && ` (${event.timezone})`}
                        </p>
                    </div>
                </div>

                <div className="flex items-start">
                    {event.locationType === 'Online' ? (
                        <Video className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                    ) : (
                        <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                    )}
                    <div>
                        <p className="font-semibold text-gray-900">Location</p>
                        <p>{event.locationType}</p>
                        {event.locationType === 'Online' ? (
                            <OnlineLocation event={event} accessible={accessible} />
                        ) : (
                            event.locationAddress && <p className="text-sm max-w-xs">{event.locationAddress}</p>
                        )}
                    </div>
                </div>

                {event.capacity && (
                    <div className="flex items-start">
                        <Users className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                        <div>
                            <p className="font-semibold text-gray-900">Capacity</p>
                            <p>{event.capacity} seats</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function EventCoverImage({ event, accessible }: { readonly event: Event; readonly accessible: boolean }) {
    const coverImageUrl = event.coverImage ? getStrapiMedia(event.coverImage.url) : null;
    const isLocalImage = coverImageUrl?.includes('localhost') || coverImageUrl?.includes('127.0.0.1');

    if (!coverImageUrl) return null;

    return (
        <div className="relative aspect-video w-full mb-12 rounded-xl overflow-hidden shadow-sm">
            <Image
                src={coverImageUrl}
                alt={event.coverImage?.alternativeText || event.title}
                fill
                unoptimized={isLocalImage}
                className={`object-cover ${accessible ? '' : 'grayscale blur-sm'}`}
                priority
            />
            {!accessible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <Lock className="w-16 h-16 text-white opacity-80" />
                </div>
            )}
        </div>
    );
}

function EventAccessCta({ isSubscriptionRestricted, user }: { readonly isSubscriptionRestricted: boolean; readonly user: any }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-center">
            {isSubscriptionRestricted ? (
                <Crown className="w-12 h-12 text-yellow-500 mb-4" />
            ) : (
                <Lock className="w-12 h-12 text-primary mb-4" />
            )}
            <h3 className="text-2xl font-bold mb-2">
                {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only Content'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
                {isSubscriptionRestricted
                    ? 'Upgrade your subscription to access this event and exclusive resources.'
                    : 'Log in to access this event content.'}
            </p>
            <div className="flex gap-4">
                {user ? (
                    <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0">
                        <Link href="/account/subscription">Upgrade Now</Link>
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="lg">
                        <Link href="/auth/login">Log In</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

function EventDescription({ event }: { readonly event: Event }) {
    if (!event.description) {
        return <p className="text-gray-500 italic">No description available.</p>;
    }
    return (
        <div className="prose prose-lg max-w-none text-gray-700">
            {typeof event.description === 'string' ? (
                <ReactMarkdown>{event.description}</ReactMarkdown>
            ) : (
                <StrapiBlocksRenderer content={event.description} />
            )}
        </div>
    );
}

export function EventAbout({ event, accessible, isSubscriptionRestricted, user }: UserEventProps) {
    return (
        <section className="relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-primary" />
                About this Event
            </h2>
            {accessible ? (
                <EventDescription event={event} />
            ) : (
                // Teaser Content + CTA
                <div className="space-y-8 relative min-h-[300px]">
                    <div className="blur-[2px] opacity-70 select-none">
                        <p className="text-xl leading-relaxed">{event.excerpt || "This event content is reserved for members."}</p>
                        <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
                        <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
                    </div>

                    <EventAccessCta isSubscriptionRestricted={isSubscriptionRestricted} user={user} />
                </div>
            )}
        </section>
    );
}

export function EventSpeakers({ event, accessible }: { readonly event: Event; readonly accessible: boolean }) {
    if (!accessible || !event.speakers || event.speakers.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary" />
                Speakers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, idx) => (
                    <div key={`${speaker.name}-${idx}`} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                            {speaker.avatar?.url && (
                                <Image
                                    src={getStrapiMedia(speaker.avatar.url)!}
                                    alt={speaker.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{speaker.name}</h3>
                            {speaker.role && <p className="text-sm text-primary font-medium">{speaker.role}</p>}
                            {speaker.linkedinUrl && (
                                <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                                    LinkedIn Profile
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function EventAgenda({ event, accessible }: { readonly event: Event; readonly accessible: boolean }) {
    if (!accessible || !event.agenda || event.agenda.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary" />
                Agenda
            </h2>
            <div className="space-y-4">
                {event.agenda.map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="bg-white border text-left border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                            <span className="text-sm font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                                {item.startTime && item.startTime.slice(0, 5)} - {item.endTime && item.endTime.slice(0, 5)}
                            </span>
                        </div>
                        {item.speaker && <p className="text-sm text-gray-600 mb-2 font-medium">Speaker: {item.speaker}</p>}
                        {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
}

import { EventRegistrationButton } from './event-registration-button';

function RegistrationButton({ event }: { readonly event: Event }) {
    // Use the new API-based registration button with waitlist support
    return (
        <EventRegistrationButton
            eventId={event.documentId}
            isRegistrationOpen={event.isRegistrationOpen}
            hasWaitlist={event.hasWaitlist}
            capacity={event.capacity}
            confirmedCount={0} // This would come from API in real-time
        />
    );
}

export function EventRegistration({ event, accessible, isSubscriptionRestricted, user }: UserEventProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Details</h3>

            <div className="space-y-4 mb-6">
                <div>
                    <p className="text-sm text-gray-500">Organizer</p>
                    <p className="font-medium text-gray-900">{event.organizer || "QBIX Academia"}</p>
                </div>

                {event.partners && event.partners.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2">In Partnership With</p>
                        <div className="flex flex-wrap gap-3">
                            {event.partners.map((partner, idx) => (
                                <div key={`${partner.name}-${idx}`} className="flex items-center space-x-2">
                                    {partner.logo?.url && (
                                        <div className="relative w-8 h-8 object-contain">
                                            <Image src={getStrapiMedia(partner.logo.url)!} alt={partner.name} fill className="object-contain" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{partner.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {accessible ? (
                <>
                    <RegistrationButton event={event} />

                    {event.hasWaitlist && event.isRegistrationOpen && (
                        <p className="text-center text-sm text-gray-500 mt-3">
                            Limited seats available. Waitlist active.
                        </p>
                    )}
                </>
            ) : (
                <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-100">
                    {isSubscriptionRestricted ? (
                        <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    ) : (
                        <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    )}
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {isSubscriptionRestricted ? 'Premium Event' : 'Members Only Event'}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                        {isSubscriptionRestricted
                            ? 'Upgrade to access and register for this event.'
                            : 'Sign in to register and access event details.'}
                    </p>
                    <div className="space-y-2">
                        {user ? (
                            <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0">
                                <Link href="/account/subscription">Upgrade Now</Link>
                            </Button>
                        ) : (
                            <Button asChild className="w-full">
                                <Link href="/auth/login">Log In</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Resources Download - Protected */}
            {event.resources && event.resources.length > 0 && accessible && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3">Resources</h4>
                    <ul className="space-y-2">
                        {event.resources.map((res, idx) => (
                            <li key={`${res.label}-${idx}`}>
                                <a
                                    href={res.link || (res.file?.url ? getStrapiMedia(res.file.url)! : '#')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-primary font-medium"
                                >
                                    {res.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {!accessible && event.resources && (
                <div className="mt-8 pt-8 border-t border-gray-100 text-center opacity-50">
                    <h4 className="font-bold text-gray-900 mb-3">Resources</h4>
                    <p className="text-sm text-gray-500 mb-2">Resources locked.</p>
                </div>
            )}
        </div>
    );
}
