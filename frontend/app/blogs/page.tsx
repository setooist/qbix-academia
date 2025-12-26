import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import { getBlogListPageSeo, getBlogs } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';
import { BlogList } from '@/components/blogs/blog-list';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getBlogListPageSeo();

  if (page && page.Seo && page.Seo.length > 0) {
    const seo = page.Seo[0];
    const imageUrl = seo.shareImage ? getStrapiMedia(seo.shareImage.url) : null;

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: imageUrl ? [imageUrl] : [],
      }
    };
  }

  return {
    title: 'All Blogs | QBix Academia',
    description: 'Explore expert insights, tutorials, and updates from the QBix Academia team.',
  };
}

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
          <BlogList blogs={blogs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
