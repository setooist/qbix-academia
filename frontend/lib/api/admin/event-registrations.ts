/**
 * Event Registration Admin API Client
 * Handles all admin operations for event registrations
 */

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface RegistrationFilters {
    status?: 'confirmed' | 'waitlisted' | 'cancelled' | 'attended';
    page?: number;
    pageSize?: number;
}

interface Registration {
    id: string;
    documentId: string;
    registration_status: 'confirmed' | 'waitlisted' | 'cancelled' | 'attended';
    waitlist_position: number | null;
    registered_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
    attended_at: string | null;
    promoted_from_waitlist_at: string | null;
    cancellation_reason: string | null;
    user: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        tier?: string;
        role?: {
            name: string;
            type: string;
        };
    };
    event: {
        id: string;
        title: string;
        startDateTime: string;
    };
}

interface RegistrationCounts {
    confirmed: number;
    waitlisted: number;
    cancelled: number;
    attended: number;
    capacity: number | null;
    available: number | null;
}

interface EventAnalytics {
    summary: {
        totalRegistrations: number;
        confirmed: number;
        waitlisted: number;
        cancelled: number;
        attended: number;
        capacity: number | null;
        capacityUtilization: number | null;
        attendanceRate: number;
        dropOffRate: number;
    };
    byRole: Record<string, number>;
    byTier: Record<string, number>;
    timeTrends: Record<string, number>;
    waitlistMetrics: {
        averagePromotionTime: number | null;
        promotionRate: number;
    };
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('strapi_jwt');
}

/**
 * Create headers with auth token
 */
function getHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

/**
 * Get all registrations for an event
 */
export async function getEventRegistrations(
    eventId: string,
    filters?: RegistrationFilters
): Promise<{ data: Registration[]; meta: { pagination: { total: number } } }> {
    const params = new URLSearchParams();
    // Strapi v5: Filter by event relation using documentId
    params.append('filters[event][documentId][$eq]', eventId);
    params.append('populate[user][populate]', 'role');
    params.append('populate[event]', 'true');
    params.append('sort', 'registered_at:desc');

    if (filters?.status) {
        params.append('filters[registration_status]', filters.status);
    }
    if (filters?.page) {
        params.append('pagination[page]', String(filters.page));
    }
    if (filters?.pageSize) {
        params.append('pagination[pageSize]', String(filters.pageSize));
    }

    const response = await fetch(
        `${API_URL}/api/event-registrations?${params.toString()}`,
        { headers: getHeaders() }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch registrations');
    }

    return response.json();
}

/**
 * Get registration counts for an event
 */
export async function getRegistrationCounts(eventId: string): Promise<RegistrationCounts> {
    const [confirmed, waitlisted, cancelled, attended] = await Promise.all([
        getRegistrationCountByStatus(eventId, 'confirmed'),
        getRegistrationCountByStatus(eventId, 'waitlisted'),
        getRegistrationCountByStatus(eventId, 'cancelled'),
        getRegistrationCountByStatus(eventId, 'attended')
    ]);

    return {
        confirmed,
        waitlisted,
        cancelled,
        attended,
        capacity: null, // Will be fetched from event
        available: null
    };
}

async function getRegistrationCountByStatus(
    eventId: string,
    status: string
): Promise<number> {
    const params = new URLSearchParams();
    // Strapi v5: Filter by event relation using documentId
    params.append('filters[event][documentId][$eq]', eventId);
    params.append('filters[registration_status]', status);
    params.append('pagination[pageSize]', '1');

    const response = await fetch(
        `${API_URL}/api/event-registrations?${params.toString()}`,
        { headers: getHeaders() }
    );

    if (!response.ok) return 0;

    const data = await response.json();
    return data.meta?.pagination?.total || 0;
}

/**
 * Promote a user from waitlist
 */
export async function promoteFromWaitlist(registrationId: string): Promise<Registration> {
    const response = await fetch(
        `${API_URL}/api/admin/event-registrations/${registrationId}/promote`,
        {
            method: 'POST',
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to promote user');
    }

    return response.json();
}

/**
 * Demote a user to waitlist
 */
export async function demoteToWaitlist(registrationId: string): Promise<Registration> {
    const response = await fetch(
        `${API_URL}/api/admin/event-registrations/${registrationId}/demote`,
        {
            method: 'POST',
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to demote user');
    }

    return response.json();
}

/**
 * Mark attendance for a registration
 */
export async function markAttendance(registrationId: string): Promise<Registration> {
    const response = await fetch(
        `${API_URL}/api/admin/event-registrations/${registrationId}/mark-attended`,
        {
            method: 'POST',
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to mark attendance');
    }

    return response.json();
}

/**
 * Bulk mark attendance
 */
export async function bulkMarkAttendance(registrationIds: string[]): Promise<{ success: boolean; updated: number }> {
    const response = await fetch(
        `${API_URL}/api/admin/event-registrations/bulk-attendance`,
        {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ registrationIds })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to bulk mark attendance');
    }

    return response.json();
}

/**
 * Get event analytics
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    const response = await fetch(
        `${API_URL}/api/admin/events/${eventId}/analytics`,
        { headers: getHeaders() }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch analytics');
    }

    return response.json();
}

/**
 * Export attendance data
 */
export async function exportAttendance(
    eventId: string,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
    const response = await fetch(
        `${API_URL}/api/admin/events/${eventId}/export?format=${format}`,
        { headers: getHeaders() }
    );

    if (!response.ok) {
        throw new Error('Failed to export attendance');
    }

    return response.blob();
}

/**
 * Download export file
 */
export function downloadExport(blob: Blob, eventTitle: string, format: 'csv' | 'xlsx'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.replace(/\s+/g, '-')}-attendance.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Register current user for an event
 */
export async function registerForEvent(eventId: string): Promise<Registration> {
    const response = await fetch(
        `${API_URL}/api/event-registrations/events/${eventId}/register`,
        {
            method: 'POST',
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to register');
    }

    return response.json();
}

/**
 * Cancel current user's registration
 */
export async function cancelRegistration(
    registrationId: string,
    reason?: string
): Promise<Registration> {
    const response = await fetch(
        `${API_URL}/api/event-registrations/${registrationId}/cancel`,
        {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to cancel registration');
    }

    return response.json();
}

/**
 * Get current user's registration for an event
 */
export async function getMyRegistration(eventId: string): Promise<Registration | null> {
    const response = await fetch(
        `${API_URL}/api/event-registrations/events/${eventId}/my-registration`,
        { headers: getHeaders() }
    );

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get registration');
    }

    return response.json();
}

export type { Registration, RegistrationFilters, RegistrationCounts, EventAnalytics };
