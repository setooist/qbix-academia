import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
        uri: `${STRAPI_URL}/graphql`,
        fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            return fetch(uri, {
                ...options,
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));
        },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
    },
});

import { localeConfig } from '@/config/locale-config';

const GET_EVENTS = gql`
    query GetEvents($sort: [String], $locale: I18NLocaleCode) {
        events(sort: $sort, locale: $locale) {
            documentId
            title
            slug
            excerpt
            eventType
            startDateTime
            endDateTime
            timezone
            locationType
            locationAddress
            coverImage {
                url
                alternativeText
            }
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            allowedRoles {
                name
                type
            }
            allowedTiers
        }
    }
`;

const GET_EVENT_BY_SLUG = gql`
    query GetEventBySlug($slug: String!, $locale: I18NLocaleCode) {
        events(filters: { slug: { eq: $slug } }, locale: $locale) {
            documentId
            title
            slug
            excerpt
            description
            eventType
            startDateTime
            endDateTime
            timezone
            locationType
            locationAddress
            meetingLink
            capacity
            registrationLink
            isRegistrationOpen
            hasWaitlist
            organizer
            coverImage {
                url
                alternativeText
            }
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            partners {
                name
                website
                logo {
                    url
                    alternativeText
                }
            }
            speakers {
                name
                role
                bio
                linkedinUrl
                avatar {
                    url
                    alternativeText
                }
            }
            agenda {
                title
                startTime
                endTime
                description
                speaker
            }
            resources {
                label
                link
                file {
                    url
                    alternativeText
                    mime
                }
            }
            allowedRoles {
                name
                type
            }
            allowedTiers
            seo {
                metaTitle
                metaDescription
                shareImage {
                    url
                }
            }
        }
    }
`;

export interface Event {
    documentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string | any; // Blocks
    eventType: 'Webinar' | 'Workshop' | 'Masterclass' | 'Panel' | 'Meetup' | 'Other';
    startDateTime: string;
    endDateTime?: string;
    timezone?: string;
    locationType: 'Onsite' | 'Online' | 'Hybrid';
    locationAddress?: string;
    meetingLink?: string | null;
    capacity?: number;
    registrationLink?: string | null;
    isRegistrationOpen: boolean;
    hasWaitlist: boolean;
    organizer?: string;
    coverImage?: {
        url: string;
        alternativeText: string | null;
    } | null;
    category?: {
        name: string;
        slug: string;
    } | null;
    tags?: {
        name: string;
        slug: string;
    }[] | null;
    partners?: {
        name: string;
        website?: string;
        logo?: {
            url: string;
            alternativeText: string | null;
        } | null;
    }[];
    speakers?: {
        name: string;
        role?: string;
        bio?: string;
        linkedinUrl?: string;
        avatar?: {
            url: string;
            alternativeText: string | null;
        } | null;
    }[];
    agenda?: {
        title: string;
        startTime?: string;
        endTime?: string;
        description?: string;
        speaker?: string;
    }[];
    resources?: {
        label: string;
        link?: string;
        file?: {
            url: string;
            alternativeText: string | null;
            mime: string;
        } | null;
    }[] | null; // Can be null if restricted
    allowedRoles?: {
        name: string;
        type: string;
    }[];
    allowedTiers?: string[] | null;
    seo?: any[];
}

interface EventsResponse {
    events: any[];
}

interface EventQueryResponse {
    events: any[];
}

const mapEvent = (e: any): Event => ({
    ...e,
    coverImage: e.coverImage?.url ? e.coverImage : (e.coverImage?.[0] || null), // Unify media handling if array/single
    partners: e.partners?.map((p: any) => ({
        ...p,
        logo: p.logo?.url ? p.logo : (p.logo?.[0] || null)
    })),
    speakers: e.speakers?.map((s: any) => ({
        ...s,
        avatar: s.avatar?.url ? s.avatar : (s.avatar?.[0] || null)
    })),
    resources: e.resources?.map((r: any) => ({
        ...r,
        file: r.file?.url ? r.file : (r.file?.[0] || null)
    }))
});

export async function getEvents(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data } = await client.query<EventsResponse>({
            query: GET_EVENTS,
            variables: { sort: ['startDateTime:desc'], locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        const items = data?.events || [];
        return items.map(mapEvent);
    } catch (error) {
        // console.error("Error fetching events:", error);
        return [];
    }
}

export async function getEventBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data } = await client.query<EventQueryResponse>({
            query: GET_EVENT_BY_SLUG,
            variables: { slug, locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        const items = data?.events || [];
        return items.length > 0 ? mapEvent(items[0]) : null;
    } catch (error) {
        // console.error("Error fetching event by slug:", error);
        return null;
    }
}

const GET_EVENT_LIST_SEO = gql`
    query GetEventListSeo {
        pages(filters: { slug: { eq: "events" } }) {
            title
            slug
            Seo {
                metaTitle
                metaDescription
                shareImage {
                    url
                }
            }
        }
    }
`;

export async function getEventListPageSeo() {
    try {
        const { data } = await client.query<{ pages: any[] }>({
            query: GET_EVENT_LIST_SEO,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.pages?.[0] || null;
    } catch (error) {
        return null;
    }
}
