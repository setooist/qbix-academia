'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    registerForEvent,
    cancelRegistration,
    getMyRegistration,
    Registration
} from '@/lib/api/admin/event-registrations';
import {
    Loader2,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EventRegistrationButtonProps {
    eventId: string;
    isRegistrationOpen: boolean;
    hasWaitlist: boolean;
    capacity?: number | null;
    confirmedCount?: number;
    className?: string;
}

// Helper function to render button content
function renderButtonContent(
    loading: boolean,
    isFull: boolean,
    hasWaitlist: boolean,
    canWaitlist: boolean
): React.ReactNode {
    if (loading) {
        return (
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
            </>
        );
    }

    if (isFull && !hasWaitlist) {
        return 'Event Full';
    }

    if (canWaitlist) {
        return (
            <>
                <Clock className="w-4 h-4 mr-2" />
                Join Waitlist
            </>
        );
    }

    return 'Register Now';
}

export function EventRegistrationButton({
    eventId,
    isRegistrationOpen,
    hasWaitlist,
    capacity,
    confirmedCount = 0,
    className = ''
}: EventRegistrationButtonProps) {
    const { user, loading: authLoading } = useAuth();
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check existing registration on mount
    useEffect(() => {
        if (user && eventId) {
            checkRegistrationStatus();
        } else {
            setCheckingStatus(false);
        }
    }, [user, eventId]);

    const checkRegistrationStatus = async () => {
        try {
            setCheckingStatus(true);
            const reg = await getMyRegistration(eventId);
            setRegistration(reg);
        } catch (err) {
            console.error('Failed to check registration:', err);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await registerForEvent(eventId);
            setRegistration(result);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!registration) return;
        setLoading(true);
        setError(null);
        try {
            await cancelRegistration(registration.id);
            setRegistration(null);
        } catch (err: any) {
            setError(err.message || 'Cancellation failed');
        } finally {
            setLoading(false);
        }
    };

    // Not logged in
    if (!user && !authLoading) {
        return (
            <div className={`space-y-2 ${className}`}>
                <Button disabled className="w-full">
                    Login to Register
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    You need to be logged in to register for events
                </p>
            </div>
        );
    }

    // Loading states
    if (authLoading || checkingStatus) {
        return (
            <Button disabled className={`w-full ${className}`}>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
            </Button>
        );
    }

    // Registration closed
    if (!isRegistrationOpen) {
        return (
            <div className={`space-y-2 ${className}`}>
                <Button disabled variant="secondary" className="w-full">
                    Registration Closed
                </Button>
            </div>
        );
    }

    // Already registered - show status
    if (registration) {
        const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
            confirmed: { icon: CheckCircle, color: 'text-green-600', label: 'Confirmed' },
            waitlisted: { icon: Clock, color: 'text-orange-600', label: 'Waitlisted' },
            attended: { icon: CheckCircle, color: 'text-blue-600', label: 'Attended' },
            cancelled: { icon: XCircle, color: 'text-gray-500', label: 'Cancelled' }
        };

        const status = statusConfig[registration.registration_status] || statusConfig.confirmed;
        const StatusIcon = status.icon;

        return (
            <div className={`space-y-3 ${className}`}>
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    <span className="font-medium">{status.label}</span>
                    {registration.waitlist_position && (
                        <Badge variant="secondary">#{registration.waitlist_position}</Badge>
                    )}
                </div>

                {registration.registration_status !== 'cancelled' && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <XCircle className="w-4 h-4 mr-2" />
                                )}
                                Cancel Registration
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Registration?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel your registration for this event?
                                    {registration.registration_status === 'confirmed' && hasWaitlist && (
                                        <span className="block mt-2 text-orange-600">
                                            Your spot will be given to the next person on the waitlist.
                                        </span>
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancel}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Yes, Cancel
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        );
    }

    // Show registration button
    const isFull = capacity !== null && capacity !== undefined && confirmedCount >= capacity;
    const canWaitlist = isFull && hasWaitlist;

    return (
        <div className={`space-y-2 ${className}`}>
            <Button
                onClick={handleRegister}
                disabled={loading || (isFull && !hasWaitlist)}
                className="w-full"
                variant={canWaitlist ? 'secondary' : 'default'}
            >
                {renderButtonContent(loading, isFull, hasWaitlist, canWaitlist)}
            </Button>

            {capacity && (
                <p className="text-xs text-gray-500 text-center">
                    {confirmedCount} / {capacity} spots filled
                    {canWaitlist && ' • Waitlist available'}
                </p>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
