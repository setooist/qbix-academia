import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const GET_NAVIGATION = `
  query GetNavigation($locale: I18NLocaleCode) {
    navigation(locale: $locale) {
      documentId
      Menu {
        label
        href
        target
        submenu {
          label
          href
          target
          ChildSubmenu {
            label
            href
            target
          }
        }
      }
    }
  }
`;

export interface ChildSubmenu {
  label: string;
  href: string;
  target?: string | null;
}

export interface Submenu {
  label: string;
  href: string;
  target?: string | null;
  ChildSubmenu: ChildSubmenu[];
}

export interface MenuItem {
  label: string;
  href: string;
  target?: string | null;
  submenu: Submenu[];
}

export interface NavigationData {
  Menu: MenuItem[];
}

export async function getNavigation(locale: string = 'en') {
  try {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';

    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_NAVIGATION,
        variables: { locale: activeLocale },
      }),
      cache: 'force-cache',
    });

    const { data } = await response.json();
    return data?.navigation || null;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return null;
  }
}
