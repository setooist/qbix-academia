
import { fetchAboutPage } from "../lib/about";
import { AboutHero, WhoWeAre, VisionQuery, Mission, AboutVision, TimelineItem } from "../component/AboutSections";
import { notFound } from "next/navigation";

export default async function AboutPage() {
  const page = await fetchAboutPage();

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-gray-600">Content coming soon...</p>
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