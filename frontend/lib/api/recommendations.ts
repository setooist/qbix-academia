import { localeConfig } from '@/config/locale-config';
import { fetchGraphQL } from './graphql-client';

const GET_RECOMMENDATIONS = `
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
            allowedTiers
        }
    }
`;

const GET_RECOMMENDATION_BY_SLUG = `
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

const GET_RECOMMENDATION_LIST_SEO = `
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

const GET_RECOMMENDATION_SLUGS = `
    query GetRecommendationSlugs($locale: I18NLocaleCode) {
        recommendations(locale: $locale) {
            slug
            documentId
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
    allowedTiers?: string[] | null;
    seo?: {
        metaTitle: string;
        metaDescription: string;
        shareImage?: {
            url: string;
        };
    }[];
}

export async function getRecommendations(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_RECOMMENDATIONS, { locale: activeLocale });
    return data?.recommendations || [];
}

export async function getRecommendationBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_RECOMMENDATION_BY_SLUG, { slug, locale: activeLocale });
    return data?.recommendations?.[0] || null;
}

export async function getRecommendationListPageSeo() {
    const data = await fetchGraphQL(GET_RECOMMENDATION_LIST_SEO);
    return data?.pages?.[0] || null;
}

export async function getAllRecommendationSlugs(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_RECOMMENDATION_SLUGS, { locale: activeLocale });
    return data?.recommendations?.filter((r: Recommendation) => r.slug) || [];
}
