/** @type {import('next-sitemap').IConfig} */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

async function fetchStrapiData(query) {
    if (!STRAPI_TOKEN) return null;

    try {
        const res = await fetch(`${STRAPI_URL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({ query }),
        });
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching sitemap data from Strapi:', error);
        return null;
    }
}

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    generateRobotsTxt: true,
    exclude: ['/icon.png'],
    changefreq: 'weekly',
    priority: 0.7,

    additionalPaths: async (config) => {
        const result = [];

        // 1. Fetch ALL Dynamic Data from Strapi (Pages, Blogs, etc.)
        const query = `
      query {
        pages(locale: "all") {
          slug
          locale
          publishedAt
        }
        blogs(locale: "all") {
          slug
          locale
          publishedAt
        }
        caseStudies(locale: "all") {
          slug
          locale
          publishedAt
        }
        downloadables(locale: "all") {
          slug
          locale
          publishedAt
        }
      }
    `;

        const data = await fetchStrapiData(query);

        if (data) {
            // 2. Add General Pages (Home, About, Contact, etc.)
            data.pages?.forEach((item) => {
                // Handle "Home" page slug usually being empty or "home"
                let slug = item.slug;
                if (slug === 'home' || slug === 'index') {
                    slug = '';
                } else {
                    slug = `/${slug}`;
                }

                // Add listing pages if they are managed as "Pages" in Strapi
                // Ensure '/blogs', '/downloadables' exist as pages in Strapi if you want them here.

                result.push({
                    loc: `/${item.locale}${slug}`,
                    changefreq: 'weekly',
                    priority: slug === '' ? 1.0 : 0.8,
                    lastmod: item.publishedAt || new Date().toISOString(),
                });
            });

            // 3. Add Blogs
            data.blogs?.forEach((item) => {
                result.push({
                    loc: `/${item.locale}/blogs/${item.slug}`,
                    changefreq: 'weekly',
                    priority: 0.7,
                    lastmod: item.publishedAt || new Date().toISOString(),
                });
            });

            // 4. Add Case Studies
            data.caseStudies?.forEach((item) => {
                result.push({
                    loc: `/${item.locale}/case-studies/${item.slug}`,
                    changefreq: 'weekly',
                    priority: 0.7,
                    lastmod: item.publishedAt || new Date().toISOString(),
                });
            });

            // 5. Add Downloadables
            data.downloadables?.forEach((item) => {
                result.push({
                    loc: `/${item.locale}/downloadables/${item.slug}`,
                    changefreq: 'monthly',
                    priority: 0.6,
                    lastmod: item.publishedAt || new Date().toISOString(),
                });
            });
        }

        return result;
    },
};
