import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_DOWNLOADABLES = gql`
  query {
    downloadables {
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

export const fetchDownloadables = async () => {
    try {
        const data = await client.request(
            GET_DOWNLOADABLES,
            {},
            {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            }
        );
        return data.downloadables;
    } catch (error) {
        console.error("Error fetching downloadables:", error);
        return [];
    }
};

const GET_DOWNLOADABLE_BY_SLUG = gql`
  query($slug: String!) {
    downloadables(filters: { slug: { eq: $slug } }) {
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

export const fetchDownloadableBySlug = async (slug: string) => {
    try {
        const data = await client.request(
            GET_DOWNLOADABLE_BY_SLUG,
            { slug },
            {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            }
        );
        return data.downloadables[0] || null;
    } catch (error) {
        console.error("Error fetching downloadable by slug:", error);
        return null;
    }
};
