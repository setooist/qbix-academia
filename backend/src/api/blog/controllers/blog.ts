/**
 * blog controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog.blog', ({ strapi }) => ({
    async find(ctx) {
        const user = ctx.state.user;
        const userTier = user ? user.tier : 'FREE';

        // Add custom filter for tiers
        // We want blogs where allowedTiers IS NULL (public) OR allowedTiers contains userTier
        // Since allowedTiers is JSON, exact querying depends on DB.
        // For Postgres/SQLite in Strapi v4, $contains on JSON usually works for array inclusion.

        const { query } = ctx;

        const tierFilter = {
            $or: [
                { allowedTiers: { $null: true } }, // Accessible if not set
                { allowedTiers: { $contains: userTier } }, // Accessible if tier matches
                { allowedTiers: { $contains: 'FREE' } } // Always accessible if FREE is allowed
            ]
        };

        // Merge with existing filters
        query.filters = {
            ...(query.filters as any || {}),
            ...tierFilter
        };

        return super.find(ctx);
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const user = ctx.state.user;
        const userTier = user ? user.tier : 'FREE';

        // Check if user is a Mentor (by role name or type)
        // Adjust 'Mentor' string if your role name is different (e.g. 'mentor')
        const isMentor = user?.role?.name === 'Mentor' || user?.role?.type === 'mentor';

        const entity = await strapi.entityService.findOne('api::blog.blog', id, {
            populate: ['allowedRoles']
        });

        if (!entity) {
            return ctx.notFound();
        }

        const allowedTiers = (entity as any).allowedTiers as string[] | null;

        // Access Check:
        // 1. Is Public? (No restrictions or explicit FREE)
        const isPublic = !allowedTiers || allowedTiers.length === 0 || allowedTiers.includes('FREE');

        // 2. Does User have Access? (Matches tier OR is a Mentor)
        const hasAccess = isPublic || isMentor || (allowedTiers && allowedTiers.includes(userTier));

        if (!hasAccess) {
            // Return a structured error so frontend can detect it and show the "Get Subscription" UI
            return ctx.forbidden('This content is exclusive to premium members.', {
                code: 'TIER_RESTRICTED',
                requiredTiers: allowedTiers
            });
        }

        return super.findOne(ctx);
    }
}));
