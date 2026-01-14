/** @type {import('next').NextConfig} */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
let strapiProtocol = 'http';
let strapiHostname = 'localhost';
let strapiPort = '1337';

try {
  const url = new URL(STRAPI_URL);
  strapiProtocol = url.protocol.replace(':', '');
  strapiHostname = url.hostname;
  strapiPort = url.port;
} catch (e) {
  console.warn("Invalid Strapi backend URL", e);
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiProtocol,
        hostname: strapiHostname,
        port: strapiPort,
        pathname: '/uploads/**',
      },
      // Fallback for local development if localhost is used
      ...(strapiHostname === 'localhost' ? [{
        protocol: 'http',
        hostname: '127.0.0.1',
        port: strapiPort,
        pathname: '/uploads/**',
      }] : []),
      {
        protocol: 'https',
        hostname: 'smiling-family-8e3c60fc7a.media.strapiapp.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'holy-chickens-9e70e06b5d.media.strapiapp.com',
      },
    ],
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