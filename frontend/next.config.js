/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["smiling-family-8e3c60fc7a.media.strapiapp.com", "localhost"],
  },
  async rewrites() {
    return [
      {
        source: '/:lang/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/:lang/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/:lang/sitemap-0.xml',
        destination: '/sitemap-0.xml',
      },
    ];
  },
};

module.exports = nextConfig;