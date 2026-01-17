import { fetchAuthGraphQL } from '../graphql-client';

const GET_ADMIN_EVENTS = `
    query GetAdminEvents($sort: [String], $pagination: PaginationArg) {
        events(sort: $sort, pagination: $pagination) {
            documentId
            title
            slug
            eventType
            startDateTime
            endDateTime
            locationType
            capacity
            hasWaitlist
            isRegistrationOpen
            publishedAt
        }
    }
`;

const GET_ADMIN_EVENT_DETAILS = `
    query GetAdminEventDetails($documentId: ID!) {
        event(documentId: $documentId) {
            documentId
            title
            slug
            eventType
            startDateTime
            endDateTime
            locationType
            capacity
            hasWaitlist
            isRegistrationOpen
            publishedAt
        }
    }
`;

export interface AdminEvent {
    documentId: string;
    id: string; // Add id for backward compatibility
    title: string;
    slug: string;
    eventType: string;
    startDateTime: string;
    endDateTime?: string;
    locationType: string;
    capacity?: number;
    hasWaitlist: boolean;
    isRegistrationOpen: boolean;
    publishedAt?: string;
    eventStatus: string; // Make required as it is always added by mapper
}

export async function getAdminEvents(token: string) {
    const data = await fetchAuthGraphQL(
        GET_ADMIN_EVENTS,
        {
            sort: ['startDateTime:desc'],
            pagination: { pageSize: 50 }
        },
        token
    );

    // Map response to match expected interface
    return data?.events?.map((e: any) => ({
        ...e,
        id: e.documentId, // Ensure backward comp. if valid
        eventStatus: getEventStatus(e)
    })) || [];
}

export async function getAdminEvent(documentId: string, token: string) {
    const data = await fetchAuthGraphQL(
        GET_ADMIN_EVENT_DETAILS,
        {
            documentId
        },
        token
    );

    const event = data?.event;
    if (!event) return null;

    return {
        ...event,
        id: event.documentId,
        eventStatus: getEventStatus(event)
    };
}

function getEventStatus(event: any): string {
    if (!event.publishedAt) return 'Draft';
    if (new Date(event.startDateTime) < new Date()) return 'Past';
    if (!event.isRegistrationOpen) return 'Closed';
    return 'Registration Open';
}
