import { Metadata } from 'next';
import { getCaseStudies, getCaseStudyListPageSeo } from '@/lib/api/case-studies';
import { CaseStudyList } from '@/components/case-studies/case-study-list';
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
  const page = await getCaseStudyListPageSeo();
  const seo = page?.Seo?.[0];

  return generateStrapiMetadata(seo, {
    title: 'Success Stories | QBix Academia',
    description: 'Read inspiring success stories from students who achieved their study abroad dreams with QBix Academia.',
  });
}

export default async function CaseStudiesPage({ params }: Readonly<Props>) {
  const { lang } = await params;
  const caseStudies = await getCaseStudies(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Success stories background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Case Studies</h1>
            <p className="text-xl text-gray-200">
              Success stories from students who achieved their study abroad dreams
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CaseStudyList caseStudies={caseStudies} />
        </div>
      </section>
    </div>
  );
}
