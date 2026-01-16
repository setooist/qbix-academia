import { localeConfig } from '@/config/locale-config';
import { fetchGraphQL } from './graphql-client';

const GET_DOWNLOADABLES = `
    query GetDownloadables($locale: I18NLocaleCode) {
        downloadables(locale: $locale) {
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
            allowedTiers
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

const GET_DOWNLOADABLE_BY_SLUG = `
    query GetDownloadableBySlug($slug: String!, $locale: I18NLocaleCode) {
        downloadables(filters: { slug: { eq: $slug } }, locale: $locale) {
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
            allowedTiers
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

const GET_DOWNLOADABLE_LIST_SEO = `
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

const GET_DOWNLOADABLE_SLUGS = `
    query GetDownloadableSlugs($locale: I18NLocaleCode) {
        downloadables(locale: $locale) {
            slug
            documentId
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
    allowedTiers?: string[] | null;
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

export async function getDownloadables(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_DOWNLOADABLES, { locale: activeLocale });
    return data?.downloadables || [];
}

export async function getDownloadableBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_DOWNLOADABLE_BY_SLUG, { slug, locale: activeLocale });
    return data?.downloadables?.[0] || null;
}

export async function getDownloadableListPageSeo() {
    const data = await fetchGraphQL(GET_DOWNLOADABLE_LIST_SEO);
    return data?.pages?.[0] || null;
}

export async function getAllDownloadableSlugs(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_DOWNLOADABLE_SLUGS, { locale: activeLocale });
    return data?.downloadables?.filter((d: Downloadable) => d.slug) || [];
}
