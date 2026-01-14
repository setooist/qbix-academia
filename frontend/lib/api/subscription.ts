
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function createCheckoutSession() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null;

    if (!token) {
        throw new Error('You must be logged in to subscribe');
    }

    const response = await fetch(`${STRAPI_URL}/api/subscription/create-checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create checkout session');
    }

    return await response.json();
}
