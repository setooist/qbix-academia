import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_DOWNLOADABLES = gql`
  query($locale: I18NLocaleCode) {
    downloadables(locale: $locale) {
      documentId
      title
      slug
      excerpt
      author
      version
      published
      file {
        url
        alternativeText
      }
      coverImage {
        url
        alternativeText
      }
      category {
        name
      }
      tag {
        name
      }
    }
  }
`;

export const fetchDownloadables = async (locale: string = "en"): Promise<any[]> => {
  try {
    const data = await client.request(
      GET_DOWNLOADABLES,
      { locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const downloadables = data.downloadables;
    return downloadables;
  } catch (error) {
    console.error("Error fetching downloadables:", error);
    return [];
  }
};

const GET_DOWNLOADABLE_BY_SLUG = gql`
  query($slug: String!, $locale: I18NLocaleCode) {
    downloadables(filters: { slug: { eq: $slug } }, locale: $locale) {
      documentId
      title
      slug
      description
      excerpt
      author
      version
      published
      file {
        url
        alternativeText
      }
      coverImage {
        url
        alternativeText
      }
       category {
        name
      }
      tag {
        name
      }
    }
  }
`;

export const fetchDownloadableBySlug = async (slug: string, locale: string = "en"): Promise<any | null> => {
  try {
    const data = await client.request(
      GET_DOWNLOADABLE_BY_SLUG,
      { slug, locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const item = data.downloadables[0];
    return item || null;
  } catch (error) {
    console.error("Error fetching downloadable by slug:", error);
    return null;
  }
};
