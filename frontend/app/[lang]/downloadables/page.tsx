
import { fetchDownloadables } from "../../lib/downloadable";
import Link from "next/link";
import Image from "next/image";
import { Download, Calendar, User, FileText } from "lucide-react";
import { fetchPageSeo } from "../../lib/seo";
import { Metadata } from 'next';
import { getLocalizedHref } from "../../helper/url";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const seo = await fetchPageSeo("downloadables", lang);

    if (!seo) {
        return {
            title: "Downloads - Setoo Jamstack",
            description: "Download resources, brochures, and guides.",
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

export default async function DownloadablesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const downloadables = await fetchDownloadables(lang);

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[var(--color-primary-text)]">Downloads</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {downloadables.map((item: any) => {
                    const url = item.coverImage?.[0]?.url;
                    const imageUrl = url
                        ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`)
                        : null;

                    return (
                        <Link href={getLocalizedHref(`/downloadables/${item.slug}`, lang)} key={item.documentId || item.slug} className="group">
                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
                                <div className="relative h-48 w-full bg-gray-200">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={item.coverImage?.[0]?.alternativeText || item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                                            <FileText size={48} className="opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex items-center text-sm text-gray-500 mb-2 gap-2 flex-wrap">
                                        {item.category?.name && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {item.category.name}
                                            </span>
                                        )}
                                        {item.published && (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{new Date(item.published).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                        {item.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>{item.author || "Setoo Team"}</span>
                                        </div>
                                        {item.version && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">v{item.version}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {downloadables.length === 0 && (
                <p className="text-center text-gray-500">No downloads available.</p>
            )}
        </main>
    );
}
