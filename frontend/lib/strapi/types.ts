export interface StrapiImage {
    id: number;
    attributes: {
        url: string;
        alternativeText: string;
        caption: string;
        width: number;
        height: number;
    };
}

export interface StrapiData<T> {
    id: number;
    attributes: T;
}

export interface StrapiResponse<T> {
    data: StrapiData<T>[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface BlogAttribute {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    is_published: boolean;
    publishedAt: string;
    featured_image?: { data: StrapiImage };
    author?: { data: StrapiData<any> };
    category?: { data: StrapiData<any> };
}

// Add other interfaces as needed, mirroring the Supabase types but adapted for Strapi's structure
