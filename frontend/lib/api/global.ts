import { localeConfig } from '@/config/locale-config';
import { fetchGraphQL } from '@/lib/api/graphql-client';

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
  const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';

  const data = await fetchGraphQL(GET_GLOBAL, { locale: activeLocale });
  return data?.global || null;
}
