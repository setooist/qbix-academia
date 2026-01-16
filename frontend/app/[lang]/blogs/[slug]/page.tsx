import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogSlugs } from '@/lib/api/blogs';
import { BlogPostView } from '@/components/blogs/blog-post-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';


import { i18nConfig } from '@/config/i18n';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of i18nConfig.locales) {
    const blogs = await getAllBlogSlugs(lang);
    blogs.forEach((blog: { slug: string }) => {
      params.push({ lang, slug: blog.slug });
    });
  }

  return params;
}

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const result = await getBlogBySlug(slug, lang);

  if (!result) {
    return {
      title: 'Blog Not Found',
    };
  }

  const blog = result; // We know it's a blog post now
  const seoItem = blog.seo && blog.seo.length > 0 ? blog.seo[0] : null;

  return generateStrapiMetadata(seoItem, {
    title: blog.title,
    description: blog.excerpt || '',
    image: (blog.coverImage && blog.coverImage.length > 0 ? getStrapiMedia(blog.coverImage[0].url) : undefined) || undefined
  });
}

export default async function BlogPostPage({ params }: Readonly<Props>) {
  const { slug, lang } = await params;
  const blog = await getBlogBySlug(slug, lang);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BlogPostView blog={blog} />
    </div>
  );
}
