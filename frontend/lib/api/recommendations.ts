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


const GET_RECOMMENDATIONS = gql`
    query GetRecommendations($locale: I18NLocaleCode) {
        recommendations(locale: $locale) {
            documentId
            title
            slug
            subtitle
            type
            authors {
                name
            }
            publisher
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            editionIsbn
            summary
            publicationDate
            readTime
            pages
            sourceUrl
            coverImage {
                url
                alternativeText
            }
            allowedRoles {
                name
                type
            }
        }
    }
`;

const GET_RECOMMENDATION_BY_SLUG = gql`
    query GetRecommendationBySlug($slug: String!, $locale: I18NLocaleCode) {
        recommendations(filters: { slug: { eq: $slug } }, locale: $locale) {
            documentId
            title
            slug
            subtitle
            type
            authors {
                name
            }
            publisher
            category {
                name
                slug
            }
            tags {
                name
                slug
            }
            editionIsbn
            summary
            keyTakeaways {
                text
            }
            publicationType
            publicationDate
            readTime
            pages
            sourceUrl
            coverImage {
                url
                alternativeText
            }
            recommendationNotes
            allowedRoles {
                name
                type
            }
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

export interface Recommendation {
    documentId: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    type: string;
    authors?: {
        name: string;
    }[];
    publisher?: string | null;
    category?: {
        name: string;
        slug: string;
    } | null;
    tags?: {
        name: string;
        slug: string;
    }[];
    editionIsbn?: string | null;
    summary?: any;
    keyTakeaways?: {
        text: string;
    }[];
    publicationType?: string | null;
    publicationDate?: string | null;
    readTime?: string | null;
    pages?: number | null;
    sourceUrl?: string | null;
    coverImage?: {
        url: string;
        alternativeText: string | null;
    } | null;
    recommendationNotes?: any;
    allowedRoles?: {
        name: string;
        type: string;
    }[];
    seo?: {
        metaTitle: string;
        metaDescription: string;
        shareImage?: {
            url: string;
        };
    }[];
}

interface RecommendationsResponse {
    recommendations: Recommendation[];
}

interface RecommendationQueryResponse {
    recommendations: Recommendation[];
}

export async function getRecommendations(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data, error } = await client.query<RecommendationsResponse>({
            query: GET_RECOMMENDATIONS,
            variables: { locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });

        return data?.recommendations || [];
    } catch (error) {
        return [];
    }
}

export async function getRecommendationBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    try {
        const { data, error } = await client.query<RecommendationQueryResponse>({
            query: GET_RECOMMENDATION_BY_SLUG,
            variables: { slug, locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.recommendations[0] || null;
    } catch (error) {
        return null;
    }
}

const GET_RECOMMENDATION_LIST_SEO = gql`
    query GetRecommendationListSeo {
        pages(filters: { slug: { eq: "recommendations" } }) {
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

export async function getRecommendationListPageSeo() {
    try {
        const { data } = await client.query<{ pages: any[] }>({
            query: GET_RECOMMENDATION_LIST_SEO,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.pages?.[0] || null;
    } catch (error) {
        return null;
    }
}
