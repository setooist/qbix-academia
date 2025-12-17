import Hero from "../component/Hero";
import FaqSection from "../component/FaqSection";
import { fetchHeroSections } from "../lib/home";
import { fetchFaqs } from "../lib/faq";

import { Metadata } from 'next';

import { fetchPageSeo } from "../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await fetchPageSeo("home", lang);

  if (!seo) return {};

  const shareImageUrl = seo.shareImage?.url?.startsWith('http')
    ? seo.shareImage.url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${seo.shareImage?.url}`;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    openGraph: {
      images: shareImageUrl ? [shareImageUrl] : [],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const heroConfig = await fetchHeroSections(lang);
  const faqs = await fetchFaqs("home", lang).then(res => res.length > 0 ? res : fetchFaqs("homepage", lang));
  const seoData = await fetchPageSeo("home", lang);

  const homepageHero = heroConfig["home"] || heroConfig["homepage"];

  return (
    <div>
      {homepageHero ? <Hero data={homepageHero} /> : <p className="text-center text-gray-500 py-10">Hero section not found.</p>}
      <FaqSection data={faqs} seo={seoData} />
    </div>
  );
}
