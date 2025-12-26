import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
        uri: `${STRAPI_URL}/graphql`,
    }),
    cache: new InMemoryCache(),
});

export const GET_GLOBAL = gql`
  query GetGlobal {
    global {
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

export async function getGlobal() {
    try {
        const { data } = await client.query<{ global: GlobalData }>({
            query: GET_GLOBAL,
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        });
        return data?.global || null;
    } catch (error) {
        console.error("Error fetching global data:", error);
        return null;
    }
}
