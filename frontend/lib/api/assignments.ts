import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null;
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

export interface ActivityTemplate {
    documentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    description?: any;
    category?: {
        name: string;
        slug: string;
    };
    tags?: {
        name: string;
        slug: string;
    }[];
    downloadables?: {
        url: string;
        name: string;
    }[];
    startDate?: string;
    goFromLink?: string;
    mentor?: {
        username: string;
        email: string;
        fullName?: string;
    };
}

export interface Assignment {
    documentId: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'needs_changes' | null;
    grade?: number;
    completedAt?: string;
    dueDate?: string;
    submissionUploads?: {
        url: string;
        name: string;
        mime?: string;
    }[];
    feedback?: any;

    // Relations
    activity?: ActivityTemplate;
    user?: {
        username: string;
        email: string;
        fullName?: string;
        id: string;
    };
    mentor?: {
        username: string;
        email: string;
        fullName?: string;
    };
}

const GET_MY_ASSIGNMENTS = gql`
    query GetMyAssignments($userId: ID!) {
        activityAssignments(filters: { assignee: { documentId: { eq: $userId } } }, sort: ["createdAt:desc"]) {
            documentId
            assignment_status
            due_date
            grade
            activity_template {
                title
                slug
                excerpt
                category {
                    name
                }
            }
        }
    }
`;

const GET_MENTOR_ASSIGNMENTS = gql`
    query GetMentorAssignments($mentorId: ID!) {
        activityAssignments(filters: { mentor: { documentId: { eq: $mentorId } } }, sort: ["createdAt:desc"]) {
            documentId
            assignment_status
            due_date
             submissions {
                 uploaded_files {
                    url
                    name
                    mime
                 }
            }
            grade
            activity_template {
                title
                slug
                category {
                    name
                }
            }
            assignee {
                username
                email
                fullName
            }
        }
    }
`;

const GET_ASSIGNMENT_BY_SLUG = gql`
    query GetAssignmentBySlug($slug: String!, $userId: ID!) {
        activityAssignments(filters: { activity_template: { slug: { eq: $slug } }, assignee: { documentId: { eq: $userId } } }) {
            documentId
            assignment_status
            due_date
            start_date
            grade
            submissions {
                 uploaded_files {
                    url
                    name
                    mime
                 }
            }
            feedback_thread
            activity_template {
                title
                slug
                excerpt
                description
                category {
                    name
                }
                tags {
                    name
                    slug
                }
                downloadables {
                    url
                    name
                }
                go_from_link
            }
            mentor {
                username
                email
            }
        }
    }
`;

const GET_ASSIGNMENT_BY_ID = gql`
    query GetAssignmentById($documentId: ID!) {
        activityAssignment(documentId: $documentId) {
            documentId
            assignment_status
            due_date
            start_date
            grade
            submissions {
                 uploaded_files {
                    url
                    name
                    mime
                 }
            }
            feedback_thread
            activity_template {
                title
                slug
                excerpt
                description
                category {
                    name
                }
                tags {
                    name
                    slug
                }
                downloadables {
                    url
                    name
                }
                go_from_link
            }
            assignee {
                username
                email
            }
            mentor {
                username
                email
            }
        }
    }
`;

// Helper to map response to Assignment interface
const mapAssignment = (data: any): Assignment => ({
    ...data,
    status: data.assignment_status || 'not_started',
    dueDate: data.due_date,
    activity: {
        ...data.activity_template,
        goFromLink: data.activity_template?.go_from_link,
        startDate: data.start_date,
    },
    user: data.assignee,
    feedback: data.feedback_thread,
    submissionUploads: data.submissions?.flatMap((s: any) => s.uploaded_files) || []
});

export async function getMyAssignments(userId: string) {
    try {
        const { data } = await client.query<{ activityAssignments: any[] }>({
            query: GET_MY_ASSIGNMENTS,
            variables: { userId }, // userId assumed to be documentId here if filter uses documentId
        });
        return data?.activityAssignments?.map(mapAssignment) || [];
    } catch (error) {
        console.error("Error fetching my assignments:", error);
        return [];
    }
}

export async function getMentorAssignments(mentorId: string) {
    try {
        const { data } = await client.query<{ activityAssignments: any[] }>({
            query: GET_MENTOR_ASSIGNMENTS,
            variables: { mentorId },
        });
        return data?.activityAssignments?.map(mapAssignment) || [];
    } catch (error) {
        console.error("Error fetching mentor assignments:", error);
        return [];
    }
}

export async function getAssignmentBySlug(slug: string, userId: string) {
    try {
        const { data } = await client.query<{ activityAssignments: any[] }>({
            query: GET_ASSIGNMENT_BY_SLUG,
            variables: { slug, userId },
        });
        const assignment = data?.activityAssignments?.[0];
        return assignment ? mapAssignment(assignment) : null;
    } catch (error) {
        console.error("Error fetching assignment by slug:", error);
        return null;
    }
}

export async function getAssignmentById(documentId: string) {
    try {
        const { data } = await client.query<{ activityAssignment: any }>({
            query: GET_ASSIGNMENT_BY_ID,
            variables: { documentId },
        });
        return data?.activityAssignment ? mapAssignment(data.activityAssignment) : null;
    } catch (error) {
        console.error("Error fetching assignment by ID:", error);
        return null;
    }
}
