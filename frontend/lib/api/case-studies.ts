import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { localeConfig } from '@/config/locale-config';

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


const GET_CASE_STUDIES = gql`
    query GetCaseStudies($locale: I18NLocaleCode) {
        caseStudies(locale: $locale) {
            documentId
            title
            slug
            studentName
            problem
            approach
            outcome
            testimonial
            publishedAt
            mediaGallery {
                url
                alternativeText
            }
            category {
                name
                slug
            }
            tag {
                name
                slug
            }
            allowedRoles {
                name
                type
            }
        }
    }
`;

const GET_CASE_STUDY_BY_SLUG = gql`
    query GetCaseStudyBySlug($slug: String!, $locale: I18NLocaleCode) {
        caseStudies(filters: { slug: { eq: $slug } }, locale: $locale) {
            documentId
            title
            slug
            studentName
            problem
            approach
            outcome
            testimonial
            publishedAt
            mediaGallery {
                url
                alternativeText
            }
            category {
                name
                slug
            }
            tag {
                name
                slug
            }
            allowedRoles {
                name
                type
            }
        }
    }
`;

export interface CaseStudy {
    documentId: string;
    title: string;
    slug: string;
    studentName?: string;
    problem?: string;
    approach?: string;
    outcome?: string;
    testimonial?: string;
    publishedAt: string;
    mediaGallery?: {
        url: string;
        alternativeText: string | null;
    }[] | null;
    category?: {
        name: string;
        slug: string;
    } | null;
    tag?: {
        name: string;
        slug: string;
    } | null;
    allowedRoles?: {
        name: string;
        type: string;
    }[];
    excerpt?: string;
    content?: string | any[];
    author?: string;
    coverImage?: {
        url: string;
        alternativeText: string | null;
    }[] | null;
    readTime?: number;
    seo?: any[];
}

interface CaseStudiesResponse {
    caseStudies: CaseStudy[];
}

interface CaseStudyQueryResponse {
    caseStudies: CaseStudy[];
}

const mapCaseStudy = (cs: any): CaseStudy => ({
    ...cs,
    excerpt: cs.problem?.substring(0, 150) + '...' || '',
    content: `## Problem\n${cs.problem}\n\n## Approach\n${cs.approach}\n\n## Outcome\n${cs.outcome}\n\n> ${cs.testimonial || ''}`, // Construct content
    author: cs.studentName,
    coverImage: cs.mediaGallery,
    readTime: 5,
});

export async function getCaseStudies(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data } = await client.query<CaseStudiesResponse>({
            query: GET_CASE_STUDIES,
            variables: { locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        const items = data?.caseStudies || [];
        return items.map(mapCaseStudy);
    } catch (error) {
        return [];
    }
}

export async function getCaseStudyBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data } = await client.query<CaseStudyQueryResponse>({
            query: GET_CASE_STUDY_BY_SLUG,
            variables: { slug, locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        const items = data?.caseStudies || [];
        return items.length > 0 ? mapCaseStudy(items[0]) : null;
    } catch (error) {
        return null;
    }
}

const GET_CASE_STUDY_LIST_SEO = gql`
    query GetCaseStudyListSeo {
        pages(filters: { slug: { eq: "case-studies" } }) {
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

export async function getCaseStudyListPageSeo() {
    try {
        const { data } = await client.query<{ pages: any[] }>({
            query: GET_CASE_STUDY_LIST_SEO,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.pages?.[0] || null;
    } catch (error) {
        return null;
    }
}
