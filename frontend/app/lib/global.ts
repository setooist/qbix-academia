import { gql } from "graphql-request";
import { client } from "./graphql";

export async function getGlobal() {
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
    const data: any = await client.request(query);

    return data?.global ?? {};
  } catch (error: any) {
    return {};
  }
}
