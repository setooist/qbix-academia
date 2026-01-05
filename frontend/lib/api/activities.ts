import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
    fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
        console.log('API Request:', uri);
        console.log('API Options:', options);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        return fetch(uri, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
    },
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null;
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
    },
});

const GET_ACTIVITIES = gql`
    query GetActivities($sort: [String]) {
        activities(sort: $sort) {
            documentId
            title
            slug
            activityStatus
            dueDate
            assignee {
                username
                email
            }
            category {
                name
            }
            # allowedRoles {
            #     name
            #     type
            # }
        }
    }
`;

const GET_ACTIVITY_BY_SLUG = gql`
    query GetActivityBySlug($slug: String!) {
        activities(filters: { slug: { eq: $slug } }) {
            documentId
            title
            slug
            excerpt
            description
            activityStatus
            startDate
            dueDate
            goFromLink
            grade
            assignee {
                username
                email
            }
            mentor {
                username
                email
            }
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            reminders
            auditTrail
            feedbackThread
            downloadables {
               url
               name
            }
            submissionUploads {
               url
               name
            }
            # allowedRoles {
            #     name
            #     type
            # }
        }
    }
`;


export interface Activity {
    documentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    description?: any; // blocks
    activityStatus: 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'under_review' | 'approved' | 'changes_requested';
    startDate?: string;
    dueDate?: string;
    goFromLink?: string;
    grade?: number;
    assignee?: {
        username: string;
        email: string;
    };
    mentor?: {
        username: string;
        email: string;
    };
    category?: {
        name: string;
        slug: string;
    };
    tags?: {
        name: string;
        slug: string;
    }[];
    reminders?: any;
    auditTrail?: any;
    feedbackThread?: any;
    downloadables?: {
        url: string;
        name: string;
    }[];
    submissionUploads?: {
        url: string;
        name: string;
    }[];
    allowedRoles?: {
        name: string;
        type: string;
    }[];
}

const GET_ACTIVITY_BY_ID = gql`
    query GetActivityById($documentId: ID!) {
        activity(documentId: $documentId) {
            documentId
            title
            slug
            excerpt
            description
            activityStatus
            startDate
            dueDate
            goFromLink
            grade
            assignee {
                username
                email
            }
            mentor {
                username
                email
            }
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            reminders
            auditTrail
            feedbackThread
            downloadables {
               url
               name
            }
            submissionUploads {
               url
               name
            }
            # allowedRoles {
            #     name
            #     type
            # }
        }
    }
`;

export async function getActivities(locale: string = 'en') {
    // const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en'; // Unused
    try {
        console.log('getActivities: executing query');
        const result = await client.query<{ activities: Activity[] }>({
            query: GET_ACTIVITIES,
            variables: {
                sort: ['createdAt:desc'],
                // locale: activeLocale, // REMOVED
                // publicationState: 'PREVIEW' // REMOVED due to backend error
            },
            errorPolicy: 'all'
        });
        console.log('getActivities: full result:', JSON.stringify(result, null, 2));
        const data = result.data;
        console.log('getActivities: query success. retrieved activities:', JSON.stringify(data?.activities, null, 2));
        return data?.activities || [];
    } catch (error) {
        console.error("getActivities: Error fetching activities:", error);
        return [];
    }
}

export async function getActivityById(documentId: string) {
    try {
        const { data } = await client.query<{ activity: Activity }>({
            query: GET_ACTIVITY_BY_ID,
            variables: {
                documentId,
                // publicationState: 'PREVIEW' // REMOVED
            },
        });
        return data?.activity || null;
    } catch (error) {
        console.error("Error fetching activity by ID:", error);
        return null;
    }
}

export async function getActivityBySlug(slug: string, locale: string = 'en') {
    // const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en'; // Unused
    try {
        const { data } = await client.query<{ activities: Activity[] }>({
            query: GET_ACTIVITY_BY_SLUG,
            variables: {
                slug,
                // locale: activeLocale, // Removed
                // publicationState: 'PREVIEW' // REMOVED
            },
        });
        return data?.activities?.[0] || null;
    } catch (error) {
        console.error("Error fetching activity by slug:", error);
        return null;
    }
}
