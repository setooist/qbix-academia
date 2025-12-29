import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';

const sitemapSections = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Content',
    links: [
      { label: 'Blogs', href: '/blogs' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Downloadables', href: '/downloadables' },
      { label: 'Recommendations', href: '/recommendations' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    title: 'User Area',
    links: [
      { label: 'Activities', href: '/activities' },
      { label: 'Team', href: '/team' },
      { label: 'My Profile', href: '/account/profile' },
      { label: 'My Library', href: '/account/library' },
      { label: 'My Activities', href: '/account/activities' },
    ],
  },
  {
    title: 'Authentication',
    links: [
      { label: 'Log In', href: '/auth/login' },
      { label: 'Sign Up', href: '/auth/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
          <p className="text-lg text-gray-700 mb-12">
            Navigate through all pages on QBIX Academia
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapSections.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border-2 hover:border-primary transition-all duration-300">
                <h2 className="text-xl font-bold mb-4 text-primary">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-primary transition-colors hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
