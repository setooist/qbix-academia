import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: `${STRAPI_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});

export const GET_FOOTER = gql`
  query GetFooter {
    footer {
      Column {
        title
        links {
          label
          url
          type
        }
      }
      Address {
        title
        addressLines
        phone
        email
        workingHours
        mapLink
      }
      Bottum {
        altText
        link
        text
        logo {
          url
          alternativeText
        }
      }
    }
  }
`;

export interface FooterLink {
  label: string;
  url: string;
  type: 'internal' | 'external';
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterAddress {
  title: string;
  addressLines: string;
  phone?: string | null;
  email?: string | null;
  workingHours?: string | null;
  mapLink?: string | null;
}

export interface FooterBottom {
  altText?: string | null;
  link?: string | null;
  text?: string | null;
  logo?: {
    url: string;
    alternativeText: string | null;
  }[];
}

export interface FooterData {
  Column: FooterColumn[];
  Address: FooterAddress;
  Bottum: FooterBottom[];
}

export async function getFooter() {
  try {
    const { data } = await client.query<{ footer: FooterData }>({
      query: GET_FOOTER,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }
        }
      }
    });
    return data?.footer || null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}
