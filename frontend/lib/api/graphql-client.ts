const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Shared GraphQL fetch client with resilient retry logic
 * Handles network flakiness and server overload during SSG builds
 */
export async function fetchGraphQL(
    query: string,
    variables: Record<string, unknown> = {},
    retries = 5,
    baseDelay = 2000
): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout per request

            const response = await fetch(`${STRAPI_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
                cache: 'force-cache', // STRICT SSG RULE
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));

            if (!response.ok) {
                // If it's a 429 (Too Many Requests) or 5xx error, throw to trigger retry
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Server returned ${response.status}`);
                }
            }

            const json = await response.json();
            if (json.errors) {
                console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
                // For SSG, we might want to return null rather than throw, 
                // but if it's a transient error, we might want to retry.
                // Generally GraphQL errors are logical (validation), so retrying won't help.
                return null;
            }
            return json.data;

        } catch (error: any) {
            const isLastAttempt = attempt === retries;

            // Log warning
            console.warn(`Fetch attempt ${attempt}/${retries} failed for query:`, error.message || error);

            if (isLastAttempt) {
                console.error("All fetch attempts failed. Returning null.");
                return null;
            }

            // Exponential backoff with jitter to prevent thundering herd
            // delay = baseDelay * 2^(attempt-1) + random_jitter
            const delay = (baseDelay * Math.pow(2, attempt - 1)) + (Math.random() * 1000);

            console.log(`Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return null;
}

/**
 * Authenticated GraphQL fetch client for Client-Side usage (Admin, User Dashboard)
 * Bypasses SSG caching and includes Authorization header
 */
export async function fetchAuthGraphQL(
    query: string,
    variables: Record<string, unknown> = {},
    token: string
): Promise<any> {
    if (!token) {
        console.warn('fetchAuthGraphQL called without token');
        return null;
    }

    try {
        const response = await fetch(`${STRAPI_URL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            cache: 'no-store', // Dynamic data, never cache
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`GraphQL request failed with status ${response.status}:`, errorBody);
            throw new Error(`Server returned ${response.status}: ${errorBody}`);
        }

        const json = await response.json();
        if (json.errors) {
            console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
            throw new Error(json.errors[0]?.message || 'GraphQL Error');
        }
        return json.data;

    } catch (error: any) {
        console.error("fetchAuthGraphQL failed:", error);
        throw error;
    }
}
