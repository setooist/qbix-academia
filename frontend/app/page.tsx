import Hero from "./component/Hero";
import FaqSection from "./component/FaqSection";
import { fetchHeroSections } from "./lib/home";
import { fetchFaqs } from "./lib/faq";

import { Metadata } from 'next';

import { fetchPageSeo } from "./lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("home");

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

export default async function Home() {
  const heroConfig = await fetchHeroSections();
  const faqs = await fetchFaqs("home").then(res => res.length > 0 ? res : fetchFaqs("homepage"));
  const seoData = await fetchPageSeo("home");

  const homepageHero = heroConfig["home"] || heroConfig["homepage"];

  console.log("Homepage", homepageHero);
  if (!homepageHero) {
    return <div>No hero content found in Strapi</div>;
  }

  return (
    <div>
      <Hero data={homepageHero} />
      <FaqSection data={faqs} seo={seoData} />
    </div>
  );
}
