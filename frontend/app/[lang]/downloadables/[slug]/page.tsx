import { notFound } from 'next/navigation';
import { getDownloadableBySlug } from '@/lib/api/downloadables';
import { DownloadableView } from '@/components/downloadables/downloadable-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const downloadable = await getDownloadableBySlug(slug);

    if (!downloadable) {
        return {
            title: 'Resource Not Found',
        };
    }

    const seoItem = downloadable.seo && downloadable.seo.length > 0 ? downloadable.seo[0] : null;

    return generateStrapiMetadata(seoItem as any, {
        title: downloadable.title,
        description: downloadable.excerpt || downloadable.title,
        image: (downloadable.coverImage?.[0] ? getStrapiMedia(downloadable.coverImage[0].url) : undefined) || undefined
    });
}

export default async function DownloadablePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const downloadable = await getDownloadableBySlug(slug);

    if (!downloadable) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <DownloadableView downloadable={downloadable} />
        </div>
    );
}
