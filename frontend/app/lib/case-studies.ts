import { gql } from "graphql-request";
import { client } from "./graphql";

const GET_CASE_STUDIES = gql`
  query($locale: I18NLocaleCode) {
    caseStudies(locale: $locale) {
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

export const fetchCaseStudies = async (locale: string = "en"): Promise<any[]> => {
  try {
    const data = await client.request(
      GET_CASE_STUDIES,
      { locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const caseStudies = data.caseStudies;
    return caseStudies;
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
};

const GET_CASE_STUDY_BY_SLUG = gql`
  query($slug: String!, $locale: I18NLocaleCode) {
    caseStudies(filters: { slug: { eq: $slug } }, locale: $locale) {
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

export const fetchCaseStudyBySlug = async (slug: string, locale: string = "en"): Promise<any | null> => {
  try {
    const data = await client.request(
      GET_CASE_STUDY_BY_SLUG,
      { slug, locale },
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      }
    );
    const study = data.caseStudies[0];
    return study || null;
  } catch (error) {
    console.error("Error fetching case study by slug:", error);
    return null;
  }
};
