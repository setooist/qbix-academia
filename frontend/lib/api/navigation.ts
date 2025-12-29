import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});

export const GET_NAVIGATION = gql`
  query GetNavigation {
    navigation {
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

export async function getNavigation() {
  try {
    const { data } = await client.query<{ navigation: NavigationData }>({
      query: GET_NAVIGATION,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }
        }
      }
    });
    return data?.navigation || null;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return null;
  }
}
