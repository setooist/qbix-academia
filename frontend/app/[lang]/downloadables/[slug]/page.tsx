
import { fetchDownloadableBySlug, fetchDownloadables } from "../../../lib/downloadable";
import { i18n } from "../../../helper/locales";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Calendar, User, FileText } from "lucide-react";
import { Metadata } from 'next';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateStaticParams() {
    const params = [];
    for (const locale of i18n.locales) {
        const downloadables = await fetchDownloadables(locale);
        params.push(...downloadables.map((item: any) => ({
            lang: locale,
            slug: item.slug,
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
    const item = await fetchDownloadableBySlug(slug, lang);

    if (!item) {
        return {
            title: "Downloadable Resource"
        };
    }

    const coverUrl = item.coverImage?.[0]?.url;
    const coverImageUrl = getUrl(coverUrl);

    return {
        title: item.title,
        description: item.excerpt || "Download this resource from Setoo Jamstack.",
        openGraph: {
            images: coverImageUrl ? [coverImageUrl] : [],
        },
    };
}

export default async function DownloadableDetailPage({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>
}) {
    const { slug, lang } = await params;
    const item = await fetchDownloadableBySlug(slug, lang);

    if (!item) {
        notFound();
    }

    const coverUrl = item.coverImage?.[0]?.url;
    const coverImageUrl = getUrl(coverUrl);

    // Handle file download URL
    const fileSource = item.file?.[0] || item.file;
    const rawFileUrl = fileSource?.url || fileSource?.attributes?.url;
    const fileUrl = getUrl(rawFileUrl);

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href={`/${lang}/downloadables`} className="text-blue-600 hover:underline mb-6 inline-flex items-center gap-1 group">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Downloads
            </Link>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="md:w-2/3">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary-text)]">{item.title}</h1>

                    <div className="flex items-center text-gray-500 mb-6 space-x-4 text-sm flex-wrap gap-y-2">
                        {item.author && (
                            <div className="flex items-center gap-1">
                                <User size={16} />
                                <span>{item.author}</span>
                            </div>
                        )}
                        {item.published && (
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{new Date(item.published).toLocaleDateString()}</span>
                            </div>
                        )}
                        {item.version && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-200">
                                v{item.version}
                            </span>
                        )}
                        {item.category?.name && (
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100">
                                {item.category.name}
                            </span>
                        )}
                    </div>

                    <div className="prose lg:prose-lg max-w-none text-gray-700">
                        {item.description ? (
                            <BlocksRenderer content={item.description} />
                        ) : (
                            <p className="italic text-gray-500">{item.excerpt || "No description available."}</p>
                        )}
                    </div>

                    {fileUrl && (
                        <div className="mt-10">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-primary-text)] text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                            >
                                <Download size={24} />
                                <div className="text-left">
                                    <div className="font-bold text-lg">Download Now</div>
                                    <div className="text-xs text-blue-100 opacity-80">Click to access file</div>
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                <div className="md:w-1/3">
                    <div className="sticky top-24">
                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                            <div className="relative h-64 w-full bg-gray-50">
                                {coverImageUrl ? (
                                    <Image
                                        src={coverImageUrl}
                                        alt={item.coverImage?.[0]?.alternativeText || item.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                        <FileText size={48} className="mb-2 opacity-50" />
                                        <span className="text-sm">Preview not available</span>
                                    </div>
                                )}
                            </div>
                            {fileUrl && (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-semibold hover:underline text-sm inline-flex items-center gap-1"
                                    >
                                        <Download size={14} /> Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
