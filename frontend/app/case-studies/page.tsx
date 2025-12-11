
import { fetchCaseStudies } from "../lib/case-studies";
import Link from "next/link";
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

import { fetchPageSeo } from "../lib/seo";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const seo = await fetchPageSeo("case-studies");

    if (!seo) {
        return {
            title: "Case Studies - Setoo Jamstack",
            description: "Success stories and student case studies.",
        };
    }

    const shareImageUrl = seo.shareImage?.url?.startsWith('http')
        ? seo.shareImage.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${seo.shareImage?.url}`;

    return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        openGraph: {
            images: shareImageUrl ? [shareImageUrl] : [],
        },
    };
}

export default async function CaseStudiesPage() {
    const caseStudies = await fetchCaseStudies();

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[var(--color-primary-text)]">Case Studies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudies.map((study: any) => {
                    const url = study.mediaGallery?.[0]?.url;
                    const imageUrl = url
                        ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`)
                        : null;

                    return (
                        <Link href={`/case-studies/${study.slug}`} key={study.documentId || study.slug} className="group">
                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row h-full">
                                <div className="relative h-48 md:h-auto md:w-1/3 bg-gray-200 shrink-0">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={study.mediaGallery[0].alternativeText || study.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {study.category?.name || "Case Study"}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                                        {study.title}
                                    </h2>
                                    {study.studentName && (
                                        <p className="text-sm text-gray-500 mb-4">Student: {study.studentName}</p>
                                    )}

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-700 text-sm">Problem:</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{study.problem}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-700 text-sm">Outcome:</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{study.outcome}</p>
                                    </div>

                                    {study.testimonial && (
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <p className="italic text-gray-500 text-sm">"{study.testimonial.substring(0, 100)}..."</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {caseStudies.length === 0 && (
                <p className="text-center text-gray-500">No case studies found.</p>
            )}
        </main>
    );
}
