import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const GET_CASE_STUDIES = `
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
            allowedTiers
        }
    }
`;

const GET_CASE_STUDY_BY_SLUG = `
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
            allowedTiers
        }
    }
`;

const GET_CASE_STUDY_LIST_SEO = `
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

const GET_CASE_STUDY_SLUGS = `
    query GetCaseStudySlugs($locale: I18NLocaleCode) {
        caseStudies(locale: $locale) {
            slug
            documentId
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
    allowedTiers?: string[] | null;
    excerpt?: string;
    content?: string;
    author?: string;
    coverImage?: {
        url: string;
        alternativeText: string | null;
    }[] | null;
    readTime?: number;
    seo?: {
        metaTitle: string;
        metaDescription: string;
        shareImage?: {
            url: string;
        };
    }[];
}

import { fetchGraphQL } from './graphql-client';

const mapCaseStudy = (cs: CaseStudy): CaseStudy => ({
    ...cs,
    excerpt: cs.problem?.substring(0, 150) + '...' || '',
    content: `## Problem\n${cs.problem}\n\n## Approach\n${cs.approach}\n\n## Outcome\n${cs.outcome}\n\n> ${cs.testimonial || ''}`,
    author: cs.studentName,
    coverImage: cs.mediaGallery,
    readTime: 5,
});

export async function getCaseStudies(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_CASE_STUDIES, { locale: activeLocale });
    const items = data?.caseStudies || [];
    return items.map(mapCaseStudy);
}

export async function getCaseStudyBySlug(slug: string, locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_CASE_STUDY_BY_SLUG, { slug, locale: activeLocale });
    const items = data?.caseStudies || [];
    return items.length > 0 ? mapCaseStudy(items[0]) : null;
}

export async function getCaseStudyListPageSeo() {
    const data = await fetchGraphQL(GET_CASE_STUDY_LIST_SEO);
    return data?.pages?.[0] || null;
}

export async function getAllCaseStudySlugs(locale: string = 'en') {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';
    const data = await fetchGraphQL(GET_CASE_STUDY_SLUGS, { locale: activeLocale });
    return data?.caseStudies?.filter((cs: CaseStudy) => cs.slug) || [];
}
