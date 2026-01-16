import { localeConfig } from '@/config/locale-config';
import { Block } from '@/lib/utils/strapi-blocks-renderer';
import { fetchGraphQL } from './graphql-client';

const GET_EVENTS = `
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

const GET_EVENT_BY_SLUG = `
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

const GET_EVENT_LIST_SEO = `
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

export interface Event {
    documentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string | Block[]; // Blocks
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
    const data = await fetchGraphQL(GET_EVENTS, { sort: ['startDateTime:desc'], locale: activeLocale });
    const items = data?.events || [];
    return items.map(mapEvent);
}

export async function getEventBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_EVENT_BY_SLUG, { slug, locale: activeLocale });
    const items = data?.events || [];
    return items.length > 0 ? mapEvent(items[0]) : null;
}

export async function getEventListPageSeo() {
    const data = await fetchGraphQL(GET_EVENT_LIST_SEO);
    return data?.pages?.[0] || null;
}