
import { fetchBlogs } from "../../lib/blogs";
import Link from "next/link";
import Image from "next/image";


import { fetchPageSeo } from "../../lib/seo";
import { Metadata } from 'next';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";



export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const seo = await fetchPageSeo("blogs", lang);

    if (!seo) {
        return {
            title: "Blogs - Setoo Jamstack",
            description: "Read our latest articles and insights.",
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

export default async function BlogsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const blogs = await fetchBlogs(lang);

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[var(--color-primary-text)]">Blogs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: any) => {
                    const url = blog.coverImage?.[0]?.url;
                    const imageUrl = url
                        ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`)
                        : "/placeholder.png";

                    return (
                        <Link href={`/${lang}/blogs/${blog.slug}`} key={blog.documentId || blog.slug} className="group">
                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
                                <div className="relative h-48 w-full bg-gray-200">
                                    {blog.coverImage?.[0]?.url ? (
                                        <Image
                                            src={imageUrl}
                                            alt={blog.coverImage[0].alternativeText || blog.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {blog.category?.name || "Uncategorized"}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>{new Date(blog.published).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                        {blog.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                                        <span>{blog.author}</span>
                                        <span>{blog.readTime ? `${blog.readTime} min read` : ""}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {blogs.length === 0 && (
                <p className="text-center text-gray-500">No blogs found.</p>
            )}
        </main>
    );
}
