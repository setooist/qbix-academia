import { fetchStrapiAPI } from '@/lib/strapi/client';

export async function getBlogs(options: {
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
} = {}) {
    const urlParams: any = {
        sort: 'publishedAt:desc',
        populate: '*',
        'pagination[pageSize]': options.limit || 10,
        'pagination[start]': options.offset || 0,
    };

    if (options.category) {
        urlParams['filters[category][slug][$eq]'] = options.category;
    }

    // Note: Deep filtering for tags might vary based on your schema
    if (options.tag) {
        urlParams['filters[tags][tag][slug][$eq]'] = options.tag;
    }

    const response = await fetchStrapiAPI('/blogs', urlParams);
    return response?.data?.map((item: any) => ({ id: item.id, ...item.attributes })) || [];
}

export async function getBlogBySlug(slug: string) {
    const urlParams = {
        'filters[slug][$eq]': slug,
        populate: '*',
    };

    const response = await fetchStrapiAPI('/blogs', urlParams);
    const item = response?.data?.[0];
    return item ? { id: item.id, ...item.attributes } : null;
}

export async function getCaseStudies(options: { limit?: number } = {}) {
    const urlParams = {
        sort: 'publishedAt:desc',
        populate: '*',
        'pagination[pageSize]': options.limit || 10,
    };
    const response = await fetchStrapiAPI('/case-studies', urlParams);
    return response?.data?.map((item: any) => ({ id: item.id, ...item.attributes })) || [];
}

export async function getDownloadables(options: { limit?: number } = {}) {
    const urlParams = {
        sort: 'publishedAt:desc',
        populate: '*',
        'pagination[pageSize]': options.limit || 10,
    };
    const response = await fetchStrapiAPI('/downloadables', urlParams);
    return response?.data?.map((item: any) => ({ id: item.id, ...item.attributes })) || [];
}

export async function getRecommendations(options: { type?: string; limit?: number } = {}) {
    const urlParams: any = {
        sort: 'publishedAt:desc',
        populate: '*',
        'pagination[pageSize]': options.limit || 10,
    };

    if (options.type) {
        urlParams['filters[recommendation_type][$eq]'] = options.type;
    }

    const response = await fetchStrapiAPI('/recommendations', urlParams);
    return response?.data?.map((item: any) => ({ id: item.id, ...item.attributes })) || [];
}

export async function getEvents(options: { upcoming?: boolean; limit?: number } = {}) {
    const urlParams: any = {
        sort: 'start_date:asc',
        populate: '*',
        'pagination[pageSize]': options.limit || 10,
    };

    if (options.upcoming) {
        // ISO date string for now
        urlParams['filters[start_date][$gte]'] = new Date().toISOString();
    }

    const response = await fetchStrapiAPI('/events', urlParams);
    return response?.data?.map((item: any) => ({ id: item.id, ...item.attributes })) || [];
}
