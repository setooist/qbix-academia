const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

async function graphqlRequest(query: string, variables?: any, jwt?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const data = await response.json();

    if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL request failed');
    }

    return data.data;
}

export async function signUp(email: string, password: string, fullName: string, phone: string, bio?: string) {
    const mutation = `
    mutation Register($input: UsersPermissionsRegisterInput!) {
      register(input: $input) {
        jwt
        user {
          documentId
          id
          username
          email
          fullName
          phone
          bio
        }
      }
    }
  `;

    const variables = {
        input: {
            username: email,
            email,
            password,
            fullName,
            phone,
            ...(bio ? { bio } : {}),
        },
    };

    try {
        const data = await graphqlRequest(mutation, variables);

        return data.register;
    } catch (error: any) {
        throw new Error(error.message || 'Registration failed');
    }
}

export async function signIn(email: string, password: string) {
    const mutation = `
    mutation Login($input: UsersPermissionsLoginInput!) {
      login(input: $input) {
        jwt
        user {
          documentId
          id
          username
          email
          fullName
          phone
          bio
          resetPasswordOnNextLogin
        }
      }
    }
  `;

    const variables = {
        input: {
            identifier: email,
            password,
        },
    };

    try {
        const data = await graphqlRequest(mutation, variables);

        if (data.login?.jwt && typeof window !== 'undefined') {
            localStorage.setItem('strapi_jwt', data.login.jwt);
        }

        return data.login;
    } catch (error: any) {
        throw new Error(error.message || 'Login failed');
    }
}

export async function signOut() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('strapi_jwt');
    }
    return Promise.resolve();
}

export async function getCurrentUser(jwt?: string) {
    if (!jwt) return null;

    try {
        const response = await fetch(`${STRAPI_URL}/api/users/me?populate[role]=*&populate[additionalRoles]=*&populate[studentProfile][populate][subscription][fields][0]=subscription_status&populate[studentProfile][populate][subscription][fields][1]=end_date&populate[studentProfile][fields][0]=subscriptionActive&populate[studentProfile][fields][1]=subscriptionValidTill`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        throw new Error('Failed to get current user: ' + error);
    }
}

export async function updateProfile(
    userId: string,
    profileData: { fullName?: string; phone?: string; bio?: string },
    jwt?: string
) {
    const token = jwt || (typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null);

    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to update profile');
        }

        return data;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to update profile');
    }
}
