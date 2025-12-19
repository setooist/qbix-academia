import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_BLOGS = gql`
  query($locale: I18NLocaleCode) {
    blogs(locale: $locale) {
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

export const fetchBlogs = async (locale: string = "en"): Promise<any[]> => {
  try {
    const data = await client.request(
      GET_BLOGS,
      { locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const blogs = data.blogs;
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

const GET_BLOG_BY_SLUG = gql`
  query($slug: String!, $locale: I18NLocaleCode) {
    blogs(filters: { slug: { eq: $slug } }, locale: $locale) {
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

export const fetchBlogBySlug = async (slug: string, locale: string = "en"): Promise<any | null> => {
  try {
    const data = await client.request(
      GET_BLOG_BY_SLUG,
      { slug, locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const blog = data.blogs[0];
    return blog || null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};
