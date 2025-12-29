import { Metadata } from 'next';
import { getEventListPageSeo, getEvents } from '@/lib/api/events';
import { EventList } from '@/components/events/event-list';
import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEventListPageSeo();
  const seo = page?.Seo?.[0];

  return generateStrapiMetadata(seo, {
    title: 'Events | QBix Academia',
    description: 'Join our webinars, workshops, and meetups to learn from industry experts.'
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Events</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Join our webinars, workshops, and seminars to guide your study abroad journey
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected with Our Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participate in our interactive sessions designed to help you make informed decisions about your education abroad
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <EventList events={events} />
      </section>
    </div>
  );
}
