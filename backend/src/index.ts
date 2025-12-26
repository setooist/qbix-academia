
export default {
  register() { },
  async bootstrap({ strapi }: { strapi: any }) {
    strapi.entityService.decorate((service) => ({
      async findMany(uid, params) {
        const result = await service.findMany(uid, params);
        if (uid !== 'api::blog.blog') return result;
        return this.sanitizeResult(strapi, result);
      },

      async findOne(uid, id, params) {
        const result = await service.findOne(uid, id, params);
        if (uid !== 'api::blog.blog') return result;
        return this.sanitizeResult(strapi, result, true);
      },

      sanitizeResult(strapi, data, isSingle = false) {
        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;

        const scrub = (blog) => {
          if (!blog) return blog;

          if (blog.allowedRoles && blog.allowedRoles.length > 0) {
            let hasAccess = false;

            if (user && user.role) {
              hasAccess = blog.allowedRoles.some(r =>
                (r.type && r.type === user.role.type) ||
                (r.id === user.role.id)
              );
            }

            if (!hasAccess) {
              blog.content = null;
            }
          }
          return blog;
        };

        if (isSingle) return scrub(data);
        if (Array.isArray(data)) return data.map(scrub);
        if (data && data.results) {
          data.results = data.results.map(scrub);
        }
        return data;
      }
    }));

    // --- Existing Logic: Disable Email Confirmation ---
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (settings.email_confirmation) {
      await pluginStore.set({
        key: 'advanced',
        value: { ...settings, email_confirmation: false },
      });
    }
  },
};
