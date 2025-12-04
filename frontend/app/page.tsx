import Hero from "./component/Hero";
import { fetchHeroSections } from "./lib/home";

export default async function Home() {
  const heroConfig = await fetchHeroSections();

  const homepageHero = heroConfig["home"] || heroConfig["homepage"];

  console.log("Homepage",homepageHero);
  if (!homepageHero) {
    return <div>No hero content found in Strapi</div>;
  }
  

  return (
    <div>
      <Hero data={homepageHero} />
    </div>
  );
}
