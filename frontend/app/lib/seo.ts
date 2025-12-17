
import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_PAGE_SEO = gql`
  query($slug: String!, $locale: I18NLocaleCode) {
    pages(filters: { slug: { eq: $slug } }, locale: $locale) {
      Seo {
        metaTitle
        metaDescription
        shareImage {
          url
          alternativeText
        }
      }
    }
  }
`;

export const fetchPageSeo = async (slug: string, locale: string = "en"): Promise<any | null> => {
  try {
    const data = await client.request(
      GET_PAGE_SEO,
      { slug, locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const seo = data.pages?.[0]?.Seo?.[0];
    return seo || null;
  } catch (error) {
    console.error(`Error fetching SEO for page ${slug}:`, error);
    return null;
  }
};
