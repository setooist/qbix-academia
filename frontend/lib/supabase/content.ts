import * as StrapiContent from '../strapi/content';
// Re-exporting Strapi functions as a temporary compatibility layer
export const getBlogs = StrapiContent.getBlogs;
export const getBlogBySlug = StrapiContent.getBlogBySlug;
export const getCaseStudies = StrapiContent.getCaseStudies;
export const getDownloadables = StrapiContent.getDownloadables;
export const getRecommendations = StrapiContent.getRecommendations;
export const getEvents = StrapiContent.getEvents;

// Fallback for types or other specific Supabase functions if needed
import { supabase } from './client';
import { Blog, CaseStudy, Downloadable, Recommendation, Event } from './types';

// End of file

