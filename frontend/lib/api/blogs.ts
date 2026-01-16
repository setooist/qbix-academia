import { localeConfig } from '@/config/locale-config';
import { fetchGraphQL } from './graphql-client';

const GET_BLOGS = `
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

const GET_BLOG_BY_SLUG = `
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

const GET_BLOG_LIST_SEO = `
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

const GET_BLOG_SLUGS = `
    query GetBlogSlugs($locale: I18NLocaleCode) {
        blogs(locale: $locale) {
            slug
            documentId
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

export async function getBlogs(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_BLOGS, { locale: activeLocale });
    return data?.blogs || [];
}

export async function getBlogBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_BLOG_BY_SLUG, { slug, locale: activeLocale });
    return data?.blogs?.[0] || null;
}

export async function getBlogListPageSeo() {
    const data = await fetchGraphQL(GET_BLOG_LIST_SEO);
    return data?.pages?.[0] || null;
}

export async function getAllBlogSlugs(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_BLOG_SLUGS, { locale: activeLocale });
    return data?.blogs?.filter((b: any) => b.slug) || [];
}

