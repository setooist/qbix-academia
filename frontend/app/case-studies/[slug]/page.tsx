
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug } from '@/lib/api/case-studies';
import { CaseStudyView } from '@/components/case-studies/case-study-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const caseStudy = await getCaseStudyBySlug(slug);

    if (!caseStudy) {
        return {
            title: 'Case Study Not Found',
        };
    }

    const seoItem = caseStudy.seo && caseStudy.seo.length > 0 ? caseStudy.seo[0] : null;

    return generateStrapiMetadata(seoItem as any, {
        title: caseStudy.title,
        description: caseStudy.excerpt || caseStudy.title,
        image: (caseStudy.coverImage?.[0] ? getStrapiMedia(caseStudy.coverImage[0].url) : undefined) || undefined
    });
}

export default async function CaseStudyPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const caseStudy = await getCaseStudyBySlug(slug);

    if (!caseStudy) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <CaseStudyView caseStudy={caseStudy} />
        </div>
    );
}
