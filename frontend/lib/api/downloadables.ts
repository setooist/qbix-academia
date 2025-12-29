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
            errorPolicy: 'all',
        },
    },
});

const GET_DOWNLOADABLES = gql`
    query GetDownloadables {
        downloadables {
            documentId
            title
            slug
            excerpt
            published
            readTime
            author
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
            version
            file {
                url
                name
                ext
                size
            }
        }
    }
`;

const GET_DOWNLOADABLE_BY_SLUG = gql`
    query GetDownloadableBySlug($slug: String!) {
        downloadables(filters: { slug: { eq: $slug } }) {
            documentId
            title
            slug
            excerpt
            description
            published
            readTime
            author
            version
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
            seo {
              metaTitle
              metaDescription
              shareImage {
                url
              }
            }
            file {
                url
                name
                ext
                size
            }
            testimonial {
                id
                quote
                author
            }
        }
    }
`;

export interface Downloadable {
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    description?: any;
    published?: string | null;
    readTime?: string | null;
    author?: string | null;
    version?: string | null;
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
    seo?: {
        metaTitle: string;
        metaDescription: string;
        shareImage?: {
            url: string;
        };
    }[];
    file?: {
        url: string;
        name: string;
        ext: string;
        size: number;
    }[] | null;
    testimonial?: {
        id: string;
        quote: string;
        author: string;
    }[] | null;
}

interface DownloadablesResponse {
    downloadables: Downloadable[];
}

interface DownloadableQueryResponse {
    downloadables: Downloadable[];
}

export async function getDownloadables() {
    try {
        const { data, error } = await client.query<DownloadablesResponse>({
            query: GET_DOWNLOADABLES,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.downloadables || [];
    } catch (error) {
        return [];
    }
}

export async function getDownloadableBySlug(slug: string) {
    try {
        const { data, error } = await client.query<DownloadableQueryResponse>({
            query: GET_DOWNLOADABLE_BY_SLUG,
            variables: { slug },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });

        return data?.downloadables[0] || null;
    } catch (error) {
        return null;
    }
}

const GET_DOWNLOADABLE_LIST_SEO = gql`
    query GetDownloadableListSeo {
        pages(filters: { slug: { eq: "downloadables" } }) {
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

export async function getDownloadableListPageSeo() {
    try {
        const { data } = await client.query<{ pages: any[] }>({
            query: GET_DOWNLOADABLE_LIST_SEO,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.pages?.[0] || null;
    } catch (error) {
        return null;
    }
}
