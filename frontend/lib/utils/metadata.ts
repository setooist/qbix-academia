import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

export interface SeoData {
    metaTitle: string;
    metaDescription: string;
    shareImage?: {
        url: string;
        alternativeText?: string;
    };
    keywords?: string;
    metaRobots?: string;
    structuredData?: any;
    metaViewport?: string;
    canonicalURL?: string;
}

export interface MetadataFallback {
    title: string;
    description: string;
    image?: string;
}

export function generateStrapiMetadata(seo: SeoData | null | undefined, fallback: MetadataFallback): Metadata {
    const title = seo?.metaTitle || fallback.title;
    const description = seo?.metaDescription || fallback.description;
    const shareImage = seo?.shareImage?.url ? getStrapiMedia(seo.shareImage.url) : fallback.image;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: shareImage ? [{ url: shareImage }] : [],
            type: 'website',
            siteName: 'QBix Academia',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: shareImage ? [shareImage] : [],
        },
        alternates: {
            canonical: seo?.canonicalURL || undefined,
        },
        robots: seo?.metaRobots || 'index, follow',
        keywords: seo?.keywords || undefined,
    };
}
