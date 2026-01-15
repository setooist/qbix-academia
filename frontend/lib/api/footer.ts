import { localeConfig } from '@/config/locale-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const GET_FOOTER = `
  query GetFooter($locale: I18NLocaleCode) {
    footer(locale: $locale) {
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

export async function getFooter(locale: string = 'en'): Promise<FooterData | null> {
  try {
    const activeLocale = localeConfig.multilanguage.enabled ? locale : 'en';

    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_FOOTER,
        variables: { locale: activeLocale },
      }),
      cache: 'force-cache',
    });

    const { data } = await response.json();
    return (data?.footer as FooterData) || null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}
