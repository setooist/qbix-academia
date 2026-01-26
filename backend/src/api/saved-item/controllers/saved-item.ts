/**
 * saved-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::saved-item.saved-item', ({ strapi }) => ({
    /**
     * Toggle save/unsave an item for the current user
     */
    async toggle(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in to save items');
        }

        const { contentType, contentId, title, slug, excerpt, coverImageUrl } = ctx.request.body;

        if (!contentType || !contentId || !title || !slug) {
            return ctx.badRequest('Missing required fields: contentType, contentId, title, slug');
        }

        // Check if item already saved
        const existingItem = await strapi.db.query('api::saved-item.saved-item').findOne({
            where: {
                user: user.id,
                contentType,
                contentId
            }
        });

        if (existingItem) {
            // Unsave - delete the item
            await strapi.db.query('api::saved-item.saved-item').delete({
                where: { id: existingItem.id }
            });

            return ctx.send({
                saved: false,
                message: 'Item removed from library'
            });
        } else {
            // Save - create new item
            const newItem = await strapi.db.query('api::saved-item.saved-item').create({
                data: {
                    user: user.id,
                    contentType,
                    contentId,
                    title,
                    slug,
                    excerpt: excerpt || null,
                    coverImageUrl: coverImageUrl || null
                }
            });

            return ctx.send({
                saved: true,
                item: newItem,
                message: 'Item saved to library'
            });
        }
    },

    /**
     * Check if an item is saved by the current user
     */
    async checkSaved(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.send({ saved: false });
        }

        const { contentType, contentId } = ctx.query;

        if (!contentType || !contentId) {
            return ctx.badRequest('Missing required query params: contentType, contentId');
        }

        const existingItem = await strapi.db.query('api::saved-item.saved-item').findOne({
            where: {
                user: user.id,
                contentType,
                contentId
            }
        });

        return ctx.send({ saved: !!existingItem });
    },

    /**
     * Get all saved items for the current user
     */
    async mySavedItems(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in to view your library');
        }

        const { contentType, page = 1, pageSize = 20 } = ctx.query;

        const where: any = { user: user.id };
        if (contentType) {
            where.contentType = contentType;
        }

        const [items, total] = await Promise.all([
            strapi.db.query('api::saved-item.saved-item').findMany({
                where,
                orderBy: { createdAt: 'desc' },
                offset: (Number(page) - 1) * Number(pageSize),
                limit: Number(pageSize)
            }),
            strapi.db.query('api::saved-item.saved-item').count({ where })
        ]);

        return ctx.send({
            data: items,
            meta: {
                pagination: {
                    page: Number(page),
                    pageSize: Number(pageSize),
                    pageCount: Math.ceil(total / Number(pageSize)),
                    total
                }
            }
        });
    }
}));
