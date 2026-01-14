import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/api/blogs';
import { BlogPostView } from '@/components/blogs/blog-post-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const result = await getBlogBySlug(slug, lang);

  // Handle error case or missing blog
  if (!result || (result as any).error) {
    return {
      title: 'Blog Not Found or Restricted',
    };
  }

  const blog = result as any; // We know it's a blog post now
  const seoItem = blog.seo && blog.seo.length > 0 ? blog.seo[0] : null;

  return generateStrapiMetadata(seoItem as any, {
    title: blog.title,
    description: blog.excerpt || '',
    image: (blog.coverImage && blog.coverImage.length > 0 ? getStrapiMedia(blog.coverImage[0].url) : undefined) || undefined
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, lang } = await params;
  const result = await getBlogBySlug(slug, lang);

  // Check if result is an error object or a blog post
  const isError = (result as any)?.error === 'TIER_RESTRICTED';
  const blog = isError ? null : result as any;

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BlogPostView blog={blog} />
    </div>
  );
}
