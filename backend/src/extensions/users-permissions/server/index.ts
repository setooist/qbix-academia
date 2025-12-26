export default (plugin) => {
    const originalRegister = plugin.controllers.auth.register;

    plugin.controllers.auth.register = async (ctx) => {
        const { fullName, phone } = ctx.request.body;

        ctx.request.body = {
            username: ctx.request.body.username,
            email: ctx.request.body.email,
            password: ctx.request.body.password,
        };

        const response = await originalRegister(ctx);

        if (response?.user?.id) {
            await strapi.entityService.update(
                'plugin::users-permissions.user',
                response.user.id,
                {
                    data: { fullName, phone },
                }
            );
        }

        return response;
    };

    return plugin;
};
