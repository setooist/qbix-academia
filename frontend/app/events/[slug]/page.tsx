import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/api/events';
import { EventView } from '@/components/events/event-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';
import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    const seoItem = event.seo && event.seo.length > 0 ? event.seo[0] : null;

    return generateStrapiMetadata(seoItem as any, {
        title: event.title,
        description: event.excerpt || event.title,
        image: (event.coverImage?.url ? getStrapiMedia(event.coverImage.url) : undefined) || undefined
    });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <EventView event={event} />
        </div>
    );
}
