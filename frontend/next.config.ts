import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["smiling-family-8e3c60fc7a.media.strapiapp.com", "localhost"],
  },
  async rewrites() {
    return [
      {
        source: '/:lang(en|fr-FR|de)/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/:lang(en|fr-FR|de)/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/:lang(en|fr-FR|de)/sitemap-0.xml',
        destination: '/sitemap-0.xml',
      },
    ];
  },
};

export default nextConfig;
