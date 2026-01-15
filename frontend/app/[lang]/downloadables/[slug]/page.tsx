import { notFound } from 'next/navigation';
import { getDownloadableBySlug, getAllDownloadableSlugs } from '@/lib/api/downloadables';
import { DownloadableView } from '@/components/downloadables/downloadable-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';
import { generateStrapiMetadata } from '@/lib/utils/metadata';
import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const params: { lang: string; slug: string }[] = [];

    for (const lang of i18nConfig.locales) {
        const downloadables = await getAllDownloadableSlugs(lang);
        downloadables.forEach((d: { slug: string }) => {
            params.push({ lang, slug: d.slug });
        });
    }

    return params;
}

type Props = {
    params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const downloadable = await getDownloadableBySlug(slug, lang);

    if (!downloadable) {
        return {
            title: 'Resource Not Found',
        };
    }

    const seoItem = downloadable.seo && downloadable.seo.length > 0 ? downloadable.seo[0] : null;

    return generateStrapiMetadata(seoItem, {
        title: downloadable.title,
        description: downloadable.excerpt || downloadable.title,
        image: (downloadable.coverImage?.[0] ? getStrapiMedia(downloadable.coverImage[0].url) : undefined) || undefined
    });
}

export default async function DownloadablePage({ params }: Readonly<Props>) {
    const { slug, lang } = await params;
    const downloadable = await getDownloadableBySlug(slug, lang);

    if (!downloadable) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <DownloadableView downloadable={downloadable} />
        </div>
    );
}
