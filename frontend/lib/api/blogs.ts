import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
        uri: `${STRAPI_URL}/graphql`,
    }),
    cache: new InMemoryCache(),
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
