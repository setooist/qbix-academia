import { notFound } from 'next/navigation';
import { getRecommendationBySlug } from '@/lib/api/recommendations';
import { RecommendationView } from '@/components/recommendations/recommendation-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const recommendation = await getRecommendationBySlug(slug);

    if (!recommendation) {
        return {
            title: 'Resource Not Found',
        };
    }

    const seoItem = recommendation.seo && recommendation.seo.length > 0 ? recommendation.seo[0] : null;

    return generateStrapiMetadata(seoItem as any, {
        title: recommendation.title,
        description: recommendation.subtitle || recommendation.title,
        image: recommendation.coverImage ? (getStrapiMedia(recommendation.coverImage.url) || undefined) : undefined
    });
}

export default async function RecommendationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const recommendation = await getRecommendationBySlug(slug);

    if (!recommendation) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <RecommendationView recommendation={recommendation} />
        </div>
    );
}
