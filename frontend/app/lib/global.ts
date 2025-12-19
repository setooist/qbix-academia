import { gql } from "graphql-request";
import { client } from "./graphql";

export async function getGlobal(locale: string = "en") {
  const query = gql`
    query($locale: I18NLocaleCode) {
      global(locale: $locale) {
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
    const data: any = await client.request(query, { locale });

    const result = data?.global ?? {};
    return result;
  } catch (error: any) {
    return {};
  }
}
