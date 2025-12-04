import { request, gql } from "graphql-request";

export async function getGlobal() {
  const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`;

  const query = gql`
    query {
      global {
        siteName
        siteDescription
        ctaButtonText
        ctaButtonLink
        logo {
          url
          alternativeText
          caption
        }
        favicon {
          url
          alternativeText
        }
        defaultSeo {
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

  const data = await request(endpoint, query);
  return data?.global ?? {};
}
