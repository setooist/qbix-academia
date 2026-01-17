'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  Settings,
  Clock
} from 'lucide-react';

import { getAdminEvents, AdminEvent } from '@/lib/api/admin/events';

// ... (imports remain)

export default function EventManagementListPage() {
  const router = useRouter();
  const { isAdmin, loading: permLoading } = usePermissions();
  const [events, setEvents] = useState<AdminEvent[]>([]); // Use AdminEvent interface
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async (token: string) => {
    try {
      const data = await getAdminEvents(token);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!permLoading && !isAdmin()) {
      router.push('/');
      return;
    }

    const token = localStorage.getItem('strapi_jwt');
    if (token) {
      fetchEvents(token);
    } else {
      setLoading(false);
    }
  }, [permLoading, isAdmin, router, fetchEvents]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (permLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Separate upcoming and past events
  const upcomingEvents = events.filter(e => !isPastEvent(e.startDateTime));
  const pastEvents = events.filter(e => isPastEvent(e.startDateTime));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">
            Manage registrations, waitlists, and attendance for your events
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-2">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                <p className="text-sm text-gray-500">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.isRegistrationOpen).length}
                </p>
                <p className="text-sm text-gray-500">Registration Open</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pastEvents.length}</p>
                <p className="text-sm text-gray-500">Past Events</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Events
            </h2>
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} formatDate={formatDate} formatTime={formatTime} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Past Events
            </h2>
            <div className="grid gap-4">
              {pastEvents.slice(0, 10).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  isPast
                />
              ))}
            </div>
            {pastEvents.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                Showing 10 of {pastEvents.length} past events
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Events Yet</h3>
              <p className="text-gray-500 mt-2">
                Create events in the Strapi admin panel to manage them here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  'Draft': 'bg-gray-100 text-gray-800',
  'Published': 'bg-blue-100 text-blue-800',
  'Registration Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-yellow-100 text-yellow-800',
  'Past': 'bg-gray-100 text-gray-600'
};

interface EventCardProps {
  event: AdminEvent;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  isPast?: boolean;
}

function EventCard({ event, formatDate, formatTime, isPast = false }: EventCardProps) {
  return (
    <Card className={`border-2 hover:shadow-lg transition-all ${isPast ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                className={statusColors[event.eventStatus] || statusColors['Draft']}
              >
                {event.eventStatus}
              </Badge>
              <Badge variant="outline">{event.eventType}</Badge>
              {event.hasWaitlist && (
                <Badge variant="secondary">Waitlist Enabled</Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              {event.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(event.startDateTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(event.startDateTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.locationType}
              </span>
              {event.capacity && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.capacity} capacity
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/events/${event.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </Button>
            </Link>
            <Link href={`/en/admin/events/${event.documentId || event.id}`}>
              <Button size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}