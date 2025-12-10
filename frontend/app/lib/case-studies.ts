import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_CASE_STUDIES = gql`
  query {
    caseStudies {
      documentId
      title
      slug
      studentName
      problem
      approach
      outcome
      testimonial
      mediaGallery {
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

export const fetchCaseStudies = async () => {
    try {
        const data = await client.request(
            GET_CASE_STUDIES,
            {},
            {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            }
        );
        return data.caseStudies;
    } catch (error) {
        console.error("Error fetching case studies:", error);
        return [];
    }
};

const GET_CASE_STUDY_BY_SLUG = gql`
  query($slug: String!) {
    caseStudies(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      studentName
      problem
      approach
      outcome
      testimonial
      mediaGallery {
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

export const fetchCaseStudyBySlug = async (slug: string) => {
    try {
        const data = await client.request(
            GET_CASE_STUDY_BY_SLUG,
            { slug },
            {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            }
        );
        return data.caseStudies[0] || null;
    } catch (error) {
        console.error("Error fetching case study by slug:", error);
        return null;
    }
};
