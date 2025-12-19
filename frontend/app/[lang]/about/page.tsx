

import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { fetchPageSeo } from "../../lib/seo";
import { fetchAboutPage } from "../../lib/about";
import { AboutHero, WhoWeAre, VisionQuery, Mission, AboutVision, TimelineItem } from "../../component/AboutSections";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await fetchPageSeo("about", lang);

  if (!seo) return {
    title: "About Us"
  };

  const shareImageUrl = seo.shareImage?.url?.startsWith('http')
    ? seo.shareImage.url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${seo.shareImage?.url} `;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    openGraph: {
      images: shareImageUrl ? [shareImageUrl] : [],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const page = await fetchAboutPage(lang);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-8 text-[var(--color-primary-text)]">About Us</h1>
        <p className="text-gray-500">Content coming soon...</p>
      </div>
    )
  }

  return (
    <main>
      {page.section?.map((section: any, index: number) => {
        switch (section.__typename) {
          case "ComponentPageAboutHero":
            return <AboutHero key={index} data={section} />;
          case "ComponentPageWhoWeAre":
            return <WhoWeAre key={index} data={section} />;
          case "ComponentPageVision":
            return <VisionQuery key={index} data={section} />;
          case "ComponentPageMission":
            return <Mission key={index} data={section} />;
          case "ComponentPageAboutVision":
            return <AboutVision key={index} data={section} />;
          case "ComponentPageTimelineItem":
            return (
              <div key={index} className="container mx-auto px-4 py-4">
                <TimelineItem data={section} />
              </div>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}