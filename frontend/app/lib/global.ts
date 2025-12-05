import { request, gql } from "graphql-request";

export async function getGlobal() {
  const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`;
  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

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

  try {
    const data = await request(
      endpoint,
      query,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return data?.global ?? {};
  } catch (error: any) {
    return {};
  }
}
