import { notFound } from 'next/navigation';
import { getEventBySlug, getAllEventSlugs } from '@/lib/api/events';
import { EventView } from '@/components/events/event-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';
import { generateStrapiMetadata } from '@/lib/utils/metadata';
import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const params: { lang: string; slug: string }[] = [];

    for (const lang of i18nConfig.locales) {
        const events = await getAllEventSlugs(lang);
        events.forEach((event: { slug: string }) => {
            params.push({ lang, slug: event.slug });
        });
    }

    return params;
}

type Props = {
    params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const event = await getEventBySlug(slug, lang);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    const seoItem = event.seo && event.seo.length > 0 ? event.seo[0] : null;

    return generateStrapiMetadata(seoItem, {
        title: event.title,
        description: event.excerpt || event.title,
        image: (event.coverImage?.url ? getStrapiMedia(event.coverImage.url) : undefined) || undefined
    });
}

export default async function EventPage({ params }: Readonly<Props>) {
    const { slug, lang } = await params;
    const event = await getEventBySlug(slug, lang);

    if (!event) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <EventView event={event} />
        </div>
    );
}

