export async function signUp(email: string, password: string, fullName: string) {
    // Strapi default registration endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/auth/local/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email, // Strapi often uses username, mapping email to username here or handle separately
            email,
            password,
            fullName, // Custom field, needs to be allowed in Strapi User content type
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
    }
    if (typeof window !== 'undefined' && data.jwt) {
        localStorage.setItem('strapi_jwt', data.jwt);
    }
    return data;
}

export async function signIn(email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/auth/local`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier: email,
            password,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
    }
    return data;
}

export async function signOut() {
    // Client-side cleanup only for JWT
    return Promise.resolve();
}

export async function getCurrentUser(jwt?: string) {
    if (!jwt) return null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/users/me?populate=*`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    if (!response.ok) return null;
    return await response.json();
}
