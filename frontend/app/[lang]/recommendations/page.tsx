import { Metadata } from 'next';
import { getRecommendationListPageSeo, getRecommendations } from '@/lib/api/recommendations';
import { RecommendationList } from '@/components/recommendations/recommendation-list';
import { generateStrapiMetadata } from '@/lib/utils/metadata';
import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return i18nConfig.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: _lang } = await params;
  const page = await getRecommendationListPageSeo();
  const seo = page?.Seo?.[0];

  return generateStrapiMetadata(seo, {
    title: 'Recommendations | QBix Academia',
    description: 'Curated books, tools, and resources for your academic journey.',
  });
}

export default async function RecommendationsPage({ params }: Readonly<Props>) {
  const { lang } = await params;
  const recommendations = await getRecommendations(lang);

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
