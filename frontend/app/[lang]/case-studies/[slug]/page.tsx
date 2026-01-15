import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getAllCaseStudySlugs } from '@/lib/api/case-studies';
import { CaseStudyView } from '@/components/case-studies/case-study-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';
import { generateStrapiMetadata } from '@/lib/utils/metadata';
import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const params: { lang: string; slug: string }[] = [];

    for (const lang of i18nConfig.locales) {
        const caseStudies = await getAllCaseStudySlugs(lang);
        caseStudies.forEach((cs: { slug: string }) => {
            params.push({ lang, slug: cs.slug });
        });
    }

    return params;
}

type Props = {
    params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const caseStudy = await getCaseStudyBySlug(slug, lang);

    if (!caseStudy) {
        return {
            title: 'Case Study Not Found',
        };
    }

    const seoItem = caseStudy.seo && caseStudy.seo.length > 0 ? caseStudy.seo[0] : null;

    return generateStrapiMetadata(seoItem, {
        title: caseStudy.title,
        description: caseStudy.excerpt || caseStudy.title,
        image: (caseStudy.coverImage?.[0] ? getStrapiMedia(caseStudy.coverImage[0].url) : undefined) || undefined
    });
}

export default async function CaseStudyPostPage({ params }: Readonly<Props>) {
    const { slug, lang } = await params;
    const caseStudy = await getCaseStudyBySlug(slug, lang);

    if (!caseStudy) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <CaseStudyView caseStudy={caseStudy} />
        </div>
    );
}
