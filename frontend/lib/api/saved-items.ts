/**
 * Saved Items API Service
 * Handles all API calls for the My Library feature
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export type SavedContentType = 'blog' | 'case-study' | 'downloadable' | 'recommendation';

export interface SavedItem {
    id: number;
    documentId: string;
    contentType: SavedContentType;
    contentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SaveItemPayload {
    contentType: SavedContentType;
    contentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImageUrl?: string;
}

export interface SavedItemsResponse {
    data: SavedItem[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('strapi_jwt');
    }
    return null;
}

/**
 * Toggle save/unsave an item
 */
export async function toggleSaveItem(payload: SaveItemPayload): Promise<{ saved: boolean; message: string }> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('You must be logged in to save items');
    }

    const response = await fetch(`${STRAPI_URL}/api/saved-items/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to save item');
    }

    return response.json();
}

/**
 * Check if an item is saved by the current user
 */
export async function checkItemSaved(
    contentType: SavedContentType,
    contentId: string
): Promise<boolean> {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        const response = await fetch(
            `${STRAPI_URL}/api/saved-items/check?contentType=${contentType}&contentId=${contentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.saved;
    } catch {
        return false;
    }
}

/**
 * Get all saved items for the current user
 */
export async function getMySavedItems(
    contentType?: SavedContentType,
    page = 1,
    pageSize = 20
): Promise<SavedItemsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('You must be logged in to view your library');
    }

    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    });

    if (contentType) {
        params.append('contentType', contentType);
    }

    const response = await fetch(
        `${STRAPI_URL}/api/saved-items/my-library?${params.toString()}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch saved items');
    }

    return response.json();
}

/**
 * Get the URL path for a saved item based on its content type
 */
export function getSavedItemUrl(item: SavedItem): string {
    const basePathMap: Record<SavedContentType, string> = {
        'blog': '/blogs',
        'case-study': '/case-studies',
        'downloadable': '/downloadables',
        'recommendation': '/recommendations'
    };

    return `${basePathMap[item.contentType]}/${item.slug}`;
}

/**
 * Get a display label for the content type
 */
export function getContentTypeLabel(contentType: SavedContentType): string {
    const labelMap: Record<SavedContentType, string> = {
        'blog': 'Blog',
        'case-study': 'Case Study',
        'downloadable': 'Downloadable',
        'recommendation': 'Recommendation'
    };

    return labelMap[contentType];
}
