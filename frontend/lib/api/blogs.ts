import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
        uri: `${STRAPI_URL}/graphql`,
        fetch: (uri: RequestInfo | URL, options?: RequestInit) => {
            return fetch(uri, options);
        },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

import { localeConfig } from '@/config/locale-config';

const GET_BLOGS = gql`
    query GetBlogs($locale: I18NLocaleCode) {
        blogs(locale: $locale) {
            documentId
            title
            slug
            excerpt
            publishedAt
            published
            readTime
            author
            editorialStatus
            coverImage {
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
            allowedTiers
        }
    }
`;

const GET_BLOG_BY_SLUG = gql`
    query GetBlogBySlug($slug: String!, $locale: I18NLocaleCode) {
        blogs(filters: { slug: { eq: $slug } }, locale: $locale) {
            documentId
            title
            slug
            excerpt
            content
            publishedAt
            published
            readTime
            author
            editorialStatus
            coverImage {
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

export interface BlogPost {
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: any;
    publishedAt: string;
    published?: string | null;
    readTime?: number | null;
    author?: string | null;
    editorialStatus?: 'Draft' | 'In Review' | 'Scheduled' | 'Published' | 'Updated' | 'Archived';
    coverImage?: {
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
    allowedTiers?: string[] | null;
    seo?: {
        metaTitle: string;
        metaDescription: string;
        shareImage?: {
            url: string;
        };
    }[];
}

interface BlogsResponse {
    blogs: BlogPost[];
}

interface BlogQueryResponse {
    blogs: BlogPost[];
}

export async function getBlogs(locale: string = 'en', token?: string) {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const context = token ? {
        headers: {
            Authorization: `Bearer ${token}`
        }
    } : {};

    try {
        const { data, error } = await client.query<BlogsResponse>({
            query: GET_BLOGS,
            variables: { locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            context
        });
        return data?.blogs || [];
    } catch (error) {
        return [];
    }
}

export async function getBlogBySlug(slug: string, locale: string = 'en', token?: string) {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const context = token ? {
        headers: {
            Authorization: `Bearer ${token}`
        }
    } : {};

    try {
        const result = await client.query<BlogQueryResponse>({
            query: GET_BLOG_BY_SLUG,
            variables: { slug, locale: activeLocale },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            context
        });

        const { data } = result;
        // Handle both standard ApolloQueryResult (errors array) and potential QueryResult (error object)
        const errors = (result as any).errors;
        const error = (result as any).error;

        const actualErrors = errors || (error?.graphQLErrors ? error.graphQLErrors : null);

        if (actualErrors?.length) {
            // Check for the specific tier restriction code we added in backend
            const tierError = actualErrors.find((e: any) => e.message.includes("TIER_RESTRICTED") || e.extensions?.code === 'TIER_RESTRICTED' || e.message.includes('forbidden'));

            if (tierError) {
                return { error: 'TIER_RESTRICTED' };
            }
        }

        return data?.blogs[0] || null;
    } catch (error) {
        return null;
    }
}

const GET_BLOG_LIST_SEO = gql`
    query GetBlogListSeo {
        pages(filters: { slug: { eq: "blogs" } }) {
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

export async function getBlogListPageSeo() {
    try {
        const { data } = await client.query<{ pages: any[] }>({
            query: GET_BLOG_LIST_SEO,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.pages?.[0] || null;
    } catch (error) {
        console.error("Error fetching blog list SEO:", error);
        return null;
    }
}
