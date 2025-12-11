
import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_PAGE_SEO = gql`
  query($slug: String!) {
    pages(filters: { slug: { eq: $slug } }) {
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

export const fetchPageSeo = async (slug: string) => {
    try {
        const data = await client.request(
            GET_PAGE_SEO,
            { slug },
            {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            }
        );
        return data.pages?.[0]?.Seo?.[0] || null;
    } catch (error) {
        console.error(`Error fetching SEO for page ${slug}:`, error);
        return null;
    }
};
