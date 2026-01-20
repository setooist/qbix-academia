export default (plugin) => {
    const originalRegister = plugin.controllers.auth.register;

    plugin.controllers.auth.register = async (ctx) => {
        const { fullName, phone, bio, username, email, password } = ctx.request.body;

        // Validate required fields
        if (!username || !username.trim()) {
            return ctx.badRequest('Username is required');
        }
        if (!email || !email.trim()) {
            return ctx.badRequest('Email is required');
        }
        if (!password || password.length < 6) {
            return ctx.badRequest('Password must be at least 6 characters');
        }

        // Check for duplicate username
        const existingUsername = await strapi.query('plugin::users-permissions.user').findOne({
            where: { username: username.toLowerCase().trim() },
        });
        if (existingUsername) {
            return ctx.badRequest('Username is already taken. Please choose a different username.');
        }

        // Check for duplicate email
        const existingEmail = await strapi.query('plugin::users-permissions.user').findOne({
            where: { email: email.toLowerCase().trim() },
        });
        if (existingEmail) {
            return ctx.badRequest('An account with this email already exists. Please use a different email or try logging in.');
        }

        // Prepare request body for original register
        ctx.request.body = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
        };

        try {
            const response = await originalRegister(ctx);

            if (response?.user?.id) {
                await strapi.entityService.update(
                    'plugin::users-permissions.user',
                    response.user.id,
                    {
                        data: { fullName, phone, bio },
                    }
                );
            }

            return response;
        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific Strapi errors
            if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
                if (error.message?.toLowerCase().includes('email')) {
                    return ctx.badRequest('An account with this email already exists.');
                }
                if (error.message?.toLowerCase().includes('username')) {
                    return ctx.badRequest('This username is already taken.');
                }
                return ctx.badRequest('This account information is already in use.');
            }

            throw error;
        }
    };

    return plugin;
};
