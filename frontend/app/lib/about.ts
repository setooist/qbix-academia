import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_ABOUT_PAGE = gql`
  query($locale: I18NLocaleCode) {
    pages(filters: { slug: { eq: "about" } }, locale: $locale) {
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

export const fetchAboutPage = async (locale: string = "en"): Promise<any | null> => {
  try {
    const data = await client.request(
      GET_ABOUT_PAGE,
      { locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const page = data.pages[0];
    return page || null;
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
};


