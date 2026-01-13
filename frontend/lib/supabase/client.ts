// Migration to Strapi in progress. 
// Supabase client is disabled.
export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase removed") }),
        signUp: async () => ({ data: null, error: new Error("Supabase removed") }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                maybeSingle: async () => ({ data: null, error: null }),
                single: async () => ({ data: null, error: null }),
                order: () => ({ limit: () => ({ range: async () => ({ data: [], error: null }) }) })
            }),
            order: () => ({
                limit: () => ({ async then() { return { data: [], error: null } } }),
                async then() { return { data: [], error: null } }
            })
        })
    })
} as any;
