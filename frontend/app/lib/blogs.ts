import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_BLOGS = gql`
  query {
    blogs {
      documentId
      title
      slug
      excerpt
      author
      readTime
      published
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

export const fetchBlogs = async () => {
  try {
    const data = await client.request(
      GET_BLOGS,
      {},
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    return data.blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

const GET_BLOG_BY_SLUG = gql`
  query($slug: String!) {
    blogs(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      content
      excerpt
      author
      readTime
      published
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

export const fetchBlogBySlug = async (slug: string) => {
  try {
    const data = await client.request(
      GET_BLOG_BY_SLUG,
      { slug },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    return data.blogs[0] || null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};
