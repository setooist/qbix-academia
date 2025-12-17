
import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_PAGE_FAQ = gql`
  query($slug: String!, $locale: I18NLocaleCode) {
    pages(filters: { slug: { eq: $slug } }, locale: $locale) {
      section {
        ... on ComponentPageFaq {
          question
          answer
        }
      }
    }
  }
`;

export const fetchFaqs = async (slug: string = "home", locale: string = "en"): Promise<any[]> => {
  try {
    const data = await client.request(
      GET_PAGE_FAQ,
      { slug, locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );

    const page = data.pages?.[0];
    if (!page) return [];

    const faqSections = page.section?.filter(
      (s: any) => s.question && s.answer
    ) || [];

    return faqSections;

  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
};
