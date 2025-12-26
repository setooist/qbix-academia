import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogs, BlogPost } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Blog background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog</h1>
            <p className="text-xl text-gray-200">
              Expert insights, tips, and guides for your study abroad journey
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: BlogPost) => {
              return (
                <Link key={blog.documentId} href={`/blogs/${blog.slug}`}>
                  <Card className="h-full border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 cursor-pointer">
                    {blog.coverImage && blog.coverImage.length > 0 && (() => {
                      const imageUrl = getStrapiMedia(blog.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                      const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                      return (
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={imageUrl}
                            unoptimized={isLocal}
                            alt={blog.coverImage[0].alternativeText || blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      );
                    })()}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        {blog.category && <Badge variant="secondary">{blog.category.name}</Badge>}
                        {blog.tag && (
                          <Badge variant="outline">
                            {blog.tag.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {blog.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.published || blog.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        {blog.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {blog.readTime} min read
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
