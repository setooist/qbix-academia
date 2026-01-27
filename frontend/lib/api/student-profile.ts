/**
 * Student Profile API
 * Handles all GraphQL operations for student profiles including:
 * - Fetching student profile by user ID
 * - Creating new student profiles
 * - Updating student profile data
 */

import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// --- Apollo Client Setup ---

const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
    fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        return fetch(uri, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
    },
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

// --- TypeScript Interfaces ---

export interface AcademicRecord {
    qualification: string;
    awardingBody?: string;
    subject?: string;
    fromTo?: string;
    results?: string;
}

export interface CourseChoice {
    country?: string;
    startDateMonth?: string;
    startDateYear?: string;
}

export interface EntranceExams {
    ieltsToefl?: boolean;
    ieltsToeflTaken?: string;
    ieltsToeflReading?: boolean;
    ieltsToeflWriting?: boolean;
    ieltsToeflListening?: boolean;
    ieltsToeflSpeaking?: boolean;
    ieltsToeflOverall?: boolean;
    greGmat?: boolean;
    greGmatTaken?: string;
    greGmatQuant?: boolean;
    greGmatVerbal?: boolean;
    greGmatAwa?: boolean;
    other?: boolean;
    otherName?: string;
    otherTaken?: string;
    otherScore?: string;
}

export interface StudentProfile {
    documentId: string;
    fullName: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    email?: string;
    mobile?: string;
    academics?: AcademicRecord[];
    firstChoice?: CourseChoice;
    secondChoice?: CourseChoice;
    entranceExams?: EntranceExams;
    declarationConfirmed?: boolean;
    declarationSigned?: string;
    declarationDate?: string;
    subscriptionActive?: boolean;
    subscriptionValidTill?: string;
    user?: {
        documentId: string;
        username: string;
        email: string;
        fullName?: string;
    };
    subscription?: {
        documentId: string;
        stripeSubscriptionId?: string;
        subscription_status?: string;
        start_date?: string;
        end_date?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentProfileInput {
    fullName: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    email?: string;
    mobile?: string;
    academics?: AcademicRecord[];
    firstChoice?: CourseChoice;
    secondChoice?: CourseChoice;
    entranceExams?: EntranceExams;
    declarationConfirmed?: boolean;
    declarationSigned?: string;
    declarationDate?: string;
    user?: string; // documentId of the user
}

// --- GraphQL Queries ---

const GET_STUDENT_PROFILE_BY_USER = gql`
    query GetStudentProfileByUser($userDocumentId: ID!) {
        studentProfiles(filters: { user: { documentId: { eq: $userDocumentId } } }) {
            documentId
            fullName
            dob
            gender
            address
            email
            mobile
            academics
            firstChoice
            secondChoice
            entranceExams
            declarationConfirmed
            declarationSigned
            declarationDate
            subscriptionActive
            subscriptionValidTill
            user {
                documentId
                username
                email
                fullName
            }
            subscription {
                documentId
                stripeSubscriptionId
                subscription_status
                start_date
                end_date
            }
            createdAt
            updatedAt
        }
    }
`;

const GET_STUDENT_PROFILE_BY_ID = gql`
    query GetStudentProfileById($documentId: ID!) {
        studentProfile(documentId: $documentId) {
            documentId
            fullName
            dob
            gender
            address
            email
            mobile
            academics
            firstChoice
            secondChoice
            entranceExams
            declarationConfirmed
            declarationSigned
            declarationDate
            subscriptionActive
            subscriptionValidTill
            user {
                documentId
                username
                email
                fullName
            }
            subscription {
                documentId
                stripeSubscriptionId
                subscription_status
                start_date
                end_date
            }
            createdAt
            updatedAt
        }
    }
`;

const GET_ALL_STUDENT_PROFILES = gql`
    query GetAllStudentProfiles($sort: [String], $pagination: PaginationArg) {
        studentProfiles(sort: $sort, pagination: $pagination) {
            documentId
            fullName
            email
            mobile
            gender
            subscriptionActive
            user {
                documentId
                username
                email
                fullName
            }
            createdAt
            updatedAt
        }
    }
`;

// --- GraphQL Mutations ---

const CREATE_STUDENT_PROFILE = gql`
    mutation CreateStudentProfile($data: StudentProfileInput!) {
        createStudentProfile(data: $data) {
            documentId
            fullName
            email
            user {
                documentId
            }
        }
    }
`;

const UPDATE_STUDENT_PROFILE = gql`
    mutation UpdateStudentProfile($documentId: ID!, $data: StudentProfileInput!) {
        updateStudentProfile(documentId: $documentId, data: $data) {
            documentId
            fullName
            email
            updatedAt
        }
    }
`;

const DELETE_STUDENT_PROFILE = gql`
    mutation DeleteStudentProfile($documentId: ID!) {
        deleteStudentProfile(documentId: $documentId) {
            documentId
        }
    }
`;

// --- API Functions ---

/**
 * Get student profile by user document ID
 */
export async function getStudentProfileByUser(userDocumentId: string): Promise<StudentProfile | null> {
    try {
        const { data } = await client.query<{ studentProfiles: StudentProfile[] }>({
            query: GET_STUDENT_PROFILE_BY_USER,
            variables: { userDocumentId },
        });
        return data?.studentProfiles?.[0] || null;
    } catch (error) {
        console.error('Error fetching student profile by user:', error);
        return null;
    }
}

/**
 * Get student profile by document ID
 */
export async function getStudentProfileById(documentId: string): Promise<StudentProfile | null> {
    try {
        const { data } = await client.query<{ studentProfile: StudentProfile }>({
            query: GET_STUDENT_PROFILE_BY_ID,
            variables: { documentId },
        });
        return data?.studentProfile || null;
    } catch (error) {
        console.error('Error fetching student profile by ID:', error);
        return null;
    }
}

/**
 * Get all student profiles with optional pagination
 */
export async function getAllStudentProfiles(
    options?: { page?: number; pageSize?: number; sort?: string[] }
): Promise<StudentProfile[]> {
    try {
        const { data } = await client.query<{ studentProfiles: StudentProfile[] }>({
            query: GET_ALL_STUDENT_PROFILES,
            variables: {
                sort: options?.sort || ['createdAt:desc'],
                pagination: options?.page ? {
                    page: options.page,
                    pageSize: options.pageSize || 10,
                } : undefined,
            },
        });
        return data?.studentProfiles || [];
    } catch (error) {
        console.error('Error fetching all student profiles:', error);
        return [];
    }
}

/**
 * Create a new student profile
 */
export async function createStudentProfile(
    profileData: StudentProfileInput
): Promise<StudentProfile | null> {
    try {
        const { data } = await client.mutate<{ createStudentProfile: StudentProfile }>({
            mutation: CREATE_STUDENT_PROFILE,
            variables: { data: profileData },
        });
        return data?.createStudentProfile || null;
    } catch (error) {
        console.error('Error creating student profile:', error);
        throw error;
    }
}

/**
 * Update an existing student profile
 */
export async function updateStudentProfile(
    documentId: string,
    profileData: Partial<StudentProfileInput>
): Promise<StudentProfile | null> {
    try {
        const { data } = await client.mutate<{ updateStudentProfile: StudentProfile }>({
            mutation: UPDATE_STUDENT_PROFILE,
            variables: { documentId, data: profileData },
        });
        return data?.updateStudentProfile || null;
    } catch (error) {
        console.error('Error updating student profile:', error);
        throw error;
    }
}

/**
 * Delete a student profile
 */
export async function deleteStudentProfile(documentId: string): Promise<boolean> {
    try {
        await client.mutate({
            mutation: DELETE_STUDENT_PROFILE,
            variables: { documentId },
        });
        return true;
    } catch (error) {
        console.error('Error deleting student profile:', error);
        throw error;
    }
}

// --- REST API Functions (Alternative approach for mutations) ---

const STRAPI_API_URL = `${STRAPI_URL}/api`;

function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('strapi_jwt');
    }
    return null;
}

/**
 * Create student profile using REST API
 * Use this if GraphQL mutations have issues with Strapi's permission system
 */
export async function createStudentProfileREST(
    profileData: StudentProfileInput
): Promise<StudentProfile> {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_API_URL}/student-profiles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: profileData }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create student profile');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Update student profile using REST API
 */
export async function updateStudentProfileREST(
    documentId: string,
    profileData: Partial<StudentProfileInput>
): Promise<StudentProfile> {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_API_URL}/student-profiles/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: profileData }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update student profile');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Get current user's student profile using REST API
 */
export async function getMyStudentProfileREST(): Promise<StudentProfile | null> {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(
        `${STRAPI_API_URL}/student-profiles?populate=user,subscription&filters[user][id][$eq]=me`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch student profile');
    }

    const result = await response.json();
    return result.data?.[0] || null;
}
