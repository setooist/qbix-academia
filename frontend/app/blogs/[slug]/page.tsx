import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/api/blogs';
import { BlogPostView } from '@/components/blogs/blog-post-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

import { generateStrapiMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const seoItem = blog.seo && blog.seo.length > 0 ? blog.seo[0] : null;

  return generateStrapiMetadata(seoItem as any, {
    title: blog.title,
    description: blog.excerpt || '',
    image: (blog.coverImage && blog.coverImage.length > 0 ? getStrapiMedia(blog.coverImage[0].url) : undefined) || undefined
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BlogPostView blog={blog} />
    </div>
  );
}
