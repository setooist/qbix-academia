
import { fetchBlogBySlug, fetchBlogs } from "../../../lib/blogs";
import { i18n } from "../../../helper/locales";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateStaticParams() {
    const params = [];
    for (const locale of i18n.locales) {
        const blogs = await fetchBlogs(locale);
        params.push(...blogs.map((blog: any) => ({
            lang: locale,
            slug: blog.slug,
        })));
    }
    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>
}): Promise<Metadata> {
    const { slug, lang } = await params;
    const blog = await fetchBlogBySlug(slug, lang);
    const seo = blog?.seo?.[0];

    if (!seo) {
        return {
            title: blog?.title || "Blog Post",
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

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>
}) {
    const { slug, lang } = await params;
    const blog = await fetchBlogBySlug(slug, lang);

    if (!blog) {
        notFound();
    }

    const url = blog.coverImage?.[0]?.url;
    const imageUrl = url
        ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`)
        : null;

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href={`/${lang}/blogs`} className="text-blue-600 hover:underline mb-6 inline-block">
                &larr; Back to Blogs
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary-text)]">{blog.title}</h1>

            <div className="flex items-center text-gray-500 mb-8 space-x-4 text-sm">
                {blog.author && <span>By {blog.author}</span>}
                {blog.published && <span>{new Date(blog.published).toLocaleDateString()}</span>}
                {blog.readTime && <span>{blog.readTime} min read</span>}
                {blog.category?.name && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {blog.category.name}
                    </span>
                )}
            </div>

            {imageUrl && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
                    <Image
                        src={imageUrl}
                        alt={blog.coverImage[0].alternativeText || blog.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="prose lg:prose-xl max-w-none">
                {blog.content ? (
                    <BlocksRenderer content={blog.content} />
                ) : (
                    <p className="italic text-gray-500">No content.</p>
                )}
            </div>
        </main>
    );
}
