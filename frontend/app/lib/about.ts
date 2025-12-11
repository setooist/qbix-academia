import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_ABOUT_PAGE = gql`
  query {
    pages {
      title
      slug
      section {
        __typename
        ... on ComponentPageAboutHero {
          title
          subtitle
          description
          coverImage {
            url
            alternativeText
          }
        }
        ... on ComponentPageWhoWeAre {
          whoWeAreTitle: title
          description
        }
        ... on ComponentPageTimelineItem {
          Year
          title
          description
        }
        ... on ComponentPageVision {
          title
          description
        }
        ... on ComponentPageMission {
            title
            description
        }
        ... on ComponentPageAboutVision {
            title
            description
        }
      }
    }
  }
`;

export const fetchAboutPage = async () => {
  try {
    const data = await client.request(
      GET_ABOUT_PAGE,
      {},
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    let aboutPage = data.pages.find((p: any) => p.slug === "about");

    if (!aboutPage) {
      aboutPage = data.pages.find((p: any) =>
        p.section?.some((s: any) => s.__typename === "ComponentPageAboutHero")
      );
    }

    return aboutPage || null;
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
};


