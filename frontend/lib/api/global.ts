import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const GET_GLOBAL = `
  query GetGlobal($locale: I18NLocaleCode) {
    global(locale: $locale) {
      siteName
      logo {
        url
        alternativeText
      }
      favicon {
        url
      }
      siteDescription
      ctaButtonText
      ctaButtonLink
    }
  }
`;

export interface GlobalData {
  siteName: string;
  logo?: {
    url: string;
    alternativeText: string | null;
  }[] | null;
  favicon?: {
    url: string;
  } | null;
  siteDescription?: string | null;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
}

export async function getGlobal(locale: string = 'en') {
  try {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';

    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_GLOBAL,
        variables: { locale: activeLocale },
      }),
      cache: 'force-cache',
    });

    const { data } = await response.json();
    return data?.global || null;
  } catch (error) {
    console.error("Error fetching global data:", error);
    return null;
  }
}
