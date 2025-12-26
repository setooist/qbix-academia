import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, Bookmark, Share2 } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {blog.category && (
                <Badge variant="secondary" className="text-sm">
                  {blog.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(blog.published || blog.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {blog.readTime} min read
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {blog.coverImage && blog.coverImage.length > 0 && (() => {
            const imageUrl = getStrapiMedia(blog.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
            const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
            return (
              <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
                <Image
                  src={imageUrl}
                  // @ts-ignore
                  unoptimized={isLocal}
                  alt={blog.coverImage[0].alternativeText || blog.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  className="object-cover"
                />
              </div>
            );
          })()}
          <div className="prose prose-lg max-w-none">
            {typeof blog.content === 'string' ? (
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            ) : (
              <div className="text-gray-800">
                {Array.isArray(blog.content) && blog.content.map((block: any, i: number) => {
                  if (block.type === 'paragraph') {
                    return <p key={i} className="mb-4">{block.children?.map((c: any) => c.text).join('')}</p>
                  }
                  if (block.type === 'heading') {
                    const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
                    return <Tag key={i} className="font-bold my-4">{block.children?.map((c: any) => c.text).join('')}</Tag>
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {blog.author && (
            <div className="mt-12 p-6 bg-muted rounded-xl">
              <h3 className="text-xl font-bold mb-2">About the Author</h3>
              <p className="text-gray-700">{blog.author}</p>
            </div>
          )}
        </div>
      </article >

      <Footer />
    </div >
  );
}
