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

const GET_BLOGS = gql`
    query GetBlogs {
        blogs {
            documentId
            title
            slug
            excerpt
            publishedAt
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
        }
    }
`;

const GET_BLOG_BY_SLUG = gql`
    query GetBlogBySlug($slug: String!) {
        blogs(filters: { slug: { eq: $slug } }) {
            documentId
            title
            slug
            excerpt
            content
            publishedAt
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
}

interface BlogsResponse {
    blogs: BlogPost[];
}

interface BlogQueryResponse {
    blogs: BlogPost[];
}

export async function getBlogs() {
    try {
        const { data, error } = await client.query<BlogsResponse>({
            query: GET_BLOGS,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.blogs || [];
    } catch (error) {
        return [];
    }
}

export async function getBlogBySlug(slug: string) {
    try {
        const { data, error } = await client.query<BlogQueryResponse>({
            query: GET_BLOG_BY_SLUG,
            variables: { slug },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
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
