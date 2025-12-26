import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/api/blogs';
import { BlogPostView } from '@/components/blogs/blog-post-view';
import { Metadata } from 'next';
import { getStrapiMedia } from '@/lib/strapi/client';

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
  const title = seoItem?.metaTitle || blog.title;
  const description = seoItem?.metaDescription || blog.excerpt || blog.title;
  const shareImage = seoItem?.shareImage?.url || blog.coverImage?.[0]?.url;
  const imageUrl = shareImage ? getStrapiMedia(shareImage) : null;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <BlogPostView blog={blog} />
      <Footer />
    </div>
  );
}
