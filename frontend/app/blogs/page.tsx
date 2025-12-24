import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import blogsData from '@/lib/data/blogs.json';

export default function BlogsPage() {
  const blogs = blogsData;

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
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                <Card className="h-full border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 cursor-pointer">
                  {blog.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={blog.featured_image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{blog.category}</Badge>
                      {blog.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
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
                        {new Date(blog.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.read_time} min read
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
