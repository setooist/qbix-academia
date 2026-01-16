import { notFound } from 'next/navigation';
import { getRecommendationBySlug, getAllRecommendationSlugs } from '@/lib/api/recommendations';
import { RecommendationView } from '@/components/recommendations/recommendation-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';
import { generateStrapiMetadata } from '@/lib/utils/metadata';
import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const params: { lang: string; slug: string }[] = [];

    for (const lang of i18nConfig.locales) {
        const recommendations = await getAllRecommendationSlugs(lang);
        recommendations.forEach((r: { slug: string }) => {
            params.push({ lang, slug: r.slug });
        });
    }

    return params;
}

type Props = {
    params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const recommendation = await getRecommendationBySlug(slug, lang);

    if (!recommendation) {
        return {
            title: 'Resource Not Found',
        };
    }

    const seoItem = recommendation.seo && recommendation.seo.length > 0 ? recommendation.seo[0] : null;

    return generateStrapiMetadata(seoItem, {
        title: recommendation.title,
        description: recommendation.subtitle || recommendation.title,
        image: recommendation.coverImage ? (getStrapiMedia(recommendation.coverImage.url) || undefined) : undefined
    });
}

export default async function RecommendationPage({ params }: Readonly<Props>) {
    const { slug, lang } = await params;
    const recommendation = await getRecommendationBySlug(slug, lang);

    if (!recommendation) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <RecommendationView recommendation={recommendation} />
        </div>
    );
}
