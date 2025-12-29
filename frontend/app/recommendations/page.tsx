import { Metadata } from 'next';
import { getRecommendationListPageSeo, getRecommendations } from '@/lib/api/recommendations';
import { getStrapiMedia } from '@/lib/strapi/client';
import { RecommendationList } from '@/components/recommendations/recommendation-list';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRecommendationListPageSeo();
  const seo = page?.Seo?.[0];

  return generateStrapiMetadata(seo, {
    title: 'Recommendations | QBix Academia',
    description: 'Curated books, tools, and resources for your academic journey.',
  });
}

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Recommendations</h1>
            <p className="text-xl text-gray-200">
              Curated books, tools, and resources to help you succeed
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendationList recommendations={recommendations} />
        </div>
      </section>
    </div>
  );
}
