
import { fetchCaseStudyBySlug, fetchCaseStudies } from "../../../lib/case-studies";
import { i18n } from "../../../helper/locales";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateStaticParams() {
    const params = [];
    for (const locale of i18n.locales) {
        const studies = await fetchCaseStudies(locale);
        params.push(...studies.map((study: any) => ({
            lang: locale,
            slug: study.slug,
        })));
    }
    return params;
}

const getUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>
}): Promise<Metadata> {
    const { slug, lang } = await params;
    const study = await fetchCaseStudyBySlug(slug, lang);

    if (!study) {
        return {
            title: "Case Study"
        };
    }

    const coverUrl = study.mediaGallery?.[0]?.url;
    const coverImageUrl = getUrl(coverUrl);

    return {
        title: study.title,
        description: study.problem || "Read our case study.",
        openGraph: {
            images: coverImageUrl ? [coverImageUrl] : [],
        },
    };
}

export default async function CaseStudyDetailPage({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>
}) {
    const { slug, lang } = await params;
    const study = await fetchCaseStudyBySlug(slug, lang);

    if (!study) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href={`/${lang}/case-studies`} className="text-green-600 hover:underline mb-6 inline-block">
                &larr; Back to Case Studies
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary-text)]">{study.title}</h1>

            <div className="flex items-center text-gray-500 mb-8 space-x-4 text-sm">
                {study.studentName && <span>Student: <span className="font-semibold text-gray-700">{study.studentName}</span></span>}
                {study.category?.name && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {study.category.name}
                    </span>
                )}
            </div>

            {/* Gallery Grid */}
            {study.mediaGallery && study.mediaGallery.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {study.mediaGallery.map((media: any, index: number) => (
                        <div key={index} className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src={media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`}
                                alt={media.alternativeText || `Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-8">
                {study.problem && (
                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">The Problem</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{study.problem}</p>
                    </section>
                )}

                {study.approach && (
                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Our Approach</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{study.approach}</p>
                    </section>
                )}

                {study.outcome && (
                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">The Outcome</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{study.outcome}</p>
                    </section>
                )}
            </div>

            {study.testimonial && (
                <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 relative">
                    <svg className="absolute top-4 left-4 w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.914 16 16.017 16H19C19.553 16 20 15.553 20 15V9C20 8.447 19.553 8 19 8H15V4H19C21.209 4 23 5.791 23 8V15C23 18.313 20.313 21 17 21H14.017ZM8.017 21L8.017 18C8.017 16.896 8.914 16 10.017 16H13C13.553 16 14 15.553 14 15V9C14 8.447 13.553 8 13 8H9V4H13C15.209 4 17 5.791 17 8V15C17 18.313 14.313 21 11 21H8.017Z" /></svg>
                    <blockquote className="text-xl italic text-gray-600 text-center relative z-10 pt-4">
                        "{study.testimonial}"
                    </blockquote>
                    {study.studentName && <p className="text-center font-semibold mt-4 text-gray-800">- {study.studentName}</p>}
                </div>
            )}

        </main>
    );
}
