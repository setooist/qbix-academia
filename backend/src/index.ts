
export default {
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    extensionService.use(({ nexus }) => ({
      types: [
        nexus.extendType({
          type: 'UsersPermissionsMe',
          definition(t) {
            t.string('fullName');
            t.string('phone');
            t.string('bio');
          },
        }),
        nexus.extendType({
          type: 'UsersPermissionsUser',
          definition(t) {
            t.string('fullName');
            t.string('phone');
            t.string('bio');
          },
        }),
        nexus.extendInputType({
          type: 'UsersPermissionsRegisterInput',
          definition(t) {
            t.string('fullName');
            t.string('phone');
            t.string('bio');
          },
        }),
      ],
    }));
  },
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

          try {
            // Bypass logic for admins/managers
            // Collect roles from primary role + additionalRoles
            let isManager = false;
            if (user) {
              const userRoles: any[] = [];

              // Primary role
              if (user.role) {
                userRoles.push(user.role);
              }
              // Additional roles
              if (user.additionalRoles && Array.isArray(user.additionalRoles)) {
                userRoles.push(...user.additionalRoles);
              }

              for (const role of userRoles) {
                const rType = role?.type?.toLowerCase();
                const rName = role?.name?.toLowerCase();
                if (rType === 'admin' || rType === 'super_admin' || rType === 'superadmin' ||
                  rType === 'mentor' || rType === 'event_manager' || rType === 'activity_manager' ||
                  (rName && (rName.includes('admin') || rName === 'mentor' || rName === 'event manager' || rName === 'activity manager'))) {
                  isManager = true;
                  break;
                }
              }
            }

            if (item.allowedRoles && Array.isArray(item.allowedRoles) && item.allowedRoles.length > 0) {
              let hasAccess = false;

              // Defensive check for potential null items in array or broken relations
              const validRoles = item.allowedRoles.filter(r => r && (r.type || r.name));

              if (isManager) {
                hasAccess = true;
              } else if (validRoles.length === 0) {
                // If roles are present but none are valid/parsable, default to no access or allow?
                // Assuming if roles are defined but broken, we should block access.
                hasAccess = false;
              } else {
                const isPubliclyAllowed = validRoles.some(r =>
                  (r.type && r.type === 'public') ||
                  (r.name && r.name.toLowerCase() === 'public')
                );

                if (isPubliclyAllowed) {
                  hasAccess = true;
                } else if (user && user.role) {
                  hasAccess = validRoles.some(r =>
                    (r.type && user.role.type && r.type === user.role.type) ||
                    (r.id && user.role.id && r.id === user.role.id)
                  );
                }
              }

              if (!hasAccess) {
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
                }
              }
            }
          } catch (e) {
            console.error("Error in sanitizeResult:", e);
          }
          return item;
        };

        if (isSingle) return scrub(data);
        if (Array.isArray(data)) return data.map(scrub);
        if (data && data.results) {
          data.results = data.results.map(scrub);
        }
        return data;
      }
    }));

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

    const roles = await strapi.query('plugin::users-permissions.role').findMany();

    let defaultRoleType = settings.default_role;
    let needsUpdate = false;

    if (!defaultRoleType || /^\d+$/.test(defaultRoleType)) {
      let targetRole;
      if (defaultRoleType && /^\d+$/.test(defaultRoleType)) {
        targetRole = roles.find(r => r.id === parseInt(defaultRoleType));
      }

      if (!targetRole) {
        targetRole = roles.find(r => r.type === 'authenticated');
      }

      if (targetRole) {
        defaultRoleType = targetRole.type;
        needsUpdate = true;
      }
    } else {
      const exists = roles.some(r => r.type === defaultRoleType);
      if (!exists) {
        const authRole = roles.find(r => r.type === 'authenticated');
        if (authRole) {
          defaultRoleType = authRole.type;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      await pluginStore.set({
        key: 'advanced',
        value: { ...settings, default_role: defaultRoleType }
      });
    }
  },
};
