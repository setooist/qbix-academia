import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});


export const GET_NAVIGATION = gql`
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

// ... interfaces ... (Keep existing, or use tool to preserve)
// I will only replace the top query and the function.

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
    const { data } = await client.query<{ navigation: NavigationData }>({
      query: GET_NAVIGATION,
      variables: { locale: activeLocale },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    });
    return data?.navigation || null;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return null;
  }
}
