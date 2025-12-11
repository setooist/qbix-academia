import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_HOME_PAGE = gql`
  query {
    pages {
      title
      slug
      section {
        __typename
        ... on ComponentPageHero {
          mainTitle
          subtitle
          description
          buttonText
          buttonLink
          missionStatement
          backgroundImage {
            url
            alternativeText
          }
        }
        ... on ComponentPageTrustIndicator {
          trustLabel
          pillarTitle
          pillarDescription
        }
      }
      }
    }
  }
`;

export const fetchHeroSections = async () => {
  try {
    const data = await client.request(
      GET_HOME_PAGE,
      {},
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const heroConfig: Record<string, any> = {};

    data.pages.forEach((page: any) => {
      const heroSection = page.section?.find(
        (s: any) => s.__typename === "ComponentPageHero"
      );

      const trustSections = page.section?.filter(
        (s: any) => s.__typename === "ComponentPageTrustIndicator"
      );

      if (heroSection) {
        heroConfig[page.slug] = {
          ...heroSection,
          trustIndicators: trustSections || [],
        };
      }
    });

    return heroConfig;
  } catch (error: any) {
    return {};
  }
};
