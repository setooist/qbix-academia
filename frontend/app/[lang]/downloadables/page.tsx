import { Metadata } from 'next';
import { getDownloadableListPageSeo, getDownloadables } from '@/lib/api/downloadables';
import { DownloadableList } from '@/components/downloadables/downloadable-list';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDownloadableListPageSeo();
  const seo = page?.Seo?.[0];

  return generateStrapiMetadata(seo, {
    title: 'Downloadables | QBix Academia',
    description: 'Access premium resources, study guides, and tools for your academic journey.',
  });
}

export default async function DownloadablesPage() {
  const downloadables = await getDownloadables();

  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Downloadables</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Free resources, guides, and checklists to support your study abroad journey
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DownloadableList downloadables={downloadables} />
        </div>
      </section>
    </div>
  );
}
