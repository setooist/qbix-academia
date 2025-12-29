
export default {
  register() { },
  async bootstrap({ strapi }: { strapi: any }) {
    strapi.entityService.decorate((service) => ({
      async findMany(uid, params) {
        const protectedTypes = ['api::blog.blog', 'api::case-studie.case-studie', 'api::downloadable.downloadable', 'api::recommendation.recommendation', 'api::event.event'];

        const result = await service.findMany(uid, params);
        if (!protectedTypes.includes(uid)) return result;
        return this.sanitizeResult(strapi, result, uid);
      },

      async findOne(uid, id, params) {
        const protectedTypes = ['api::blog.blog', 'api::case-studie.case-studie', 'api::downloadable.downloadable', 'api::recommendation.recommendation', 'api::event.event'];

        const result = await service.findOne(uid, id, params);
        if (!protectedTypes.includes(uid)) return result;
        return this.sanitizeResult(strapi, result, uid, true);
      },

      sanitizeResult(strapi, data, uid, isSingle = false) {
        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;

        const scrub = (item) => {
          if (!item) return item;

          // If allowedRoles is defined and not empty, we check restrictions.
          if (item.allowedRoles && Array.isArray(item.allowedRoles) && item.allowedRoles.length > 0) {
            let hasAccess = false;

            // 1. Check for Public access
            const isPubliclyAllowed = item.allowedRoles.some(r =>
              (r.type && r.type === 'public') ||
              (r.name && r.name.toLowerCase() === 'public')
            );

            if (isPubliclyAllowed) {
              hasAccess = true;
            } else if (user && user.role) {
              // 2. Check for Authenticated User access
              hasAccess = item.allowedRoles.some(r =>
                (r.type && r.type === user.role.type) ||
                (r.id === user.role.id)
              );
            }

            if (!hasAccess) {
              // Hide sensitive content
              if (uid === 'api::blog.blog') {
                item.content = null;
              }
              if (uid === 'api::case-studie.case-studie') {
                item.problem = null;
                item.approach = null;
                item.outcome = null;
                item.testimonial = null;
              }
              if (uid === 'api::downloadable.downloadable') {
                item.file = null;
                item.description = null;
              }
              if (uid === 'api::recommendation.recommendation') {
                item.recommendationNotes = null;
                item.keyTakeaways = null;
              }
              if (uid === 'api::event.event') {
                item.meetingLink = null;
                item.resources = null;
                item.registrationLink = null;
                // Maybe keep description? Events usually show public description.
                // Keeping description visible but hiding sensitive links.
              }
            }
          }
          return item;
        };

        if (isSingle) return scrub(data);
        if (Array.isArray(data)) return data.map(scrub);
        // Handle { results: [...] } structure
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
