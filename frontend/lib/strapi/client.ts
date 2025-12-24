export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }
    return `${STRAPI_URL}${url}`;
}

export async function fetchStrapiAPI(
    path: string,
    urlParamsObject: Record<string, any> = {},
    options: RequestInit = {}
) {
    try {
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
            },
            ...options,
        };

        const queryString = new URLSearchParams();
        Object.entries(urlParamsObject).forEach(([key, value]) => {
            // Basic handling for nested objects/arrays if standard URLSearchParams doesn't align with Strapi's expectation
            // Ideally use 'qs' but fallback to manual appending
            if (typeof value === 'object') {
                // simplified flat serialization for common Strapi filters
                // e.g. filters[slug][$eq] is passed as a string key usually
                console.warn("Complex object params might need manual stringification without 'qs'");
            }
            queryString.append(key, String(value));
        });

        // If the caller passed a structured object that needs qs, they might fail here.
        // Ideally we assume keys are already formatted like 'filters[slug][$eq]'

        const requestUrl = `${STRAPI_URL}/api${path}${queryString.toString() ? `?${queryString.toString()}` : ""}`;
        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error(`An error occurred please try again`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error(`Please check if your Strapi server is running.`);
    }
}
