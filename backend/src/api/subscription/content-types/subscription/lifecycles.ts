export default {
    async beforeDelete(event) {
        const { where } = event.params;

        // Fetch the subscription being deleted to get the associated user
        // We need to fetch it *before* it's deleted
        const subscription = await strapi.db.query('api::subscription.subscription').findOne({
            where,
            populate: ['user'],
        });

        // Store user ID in state to use it in afterDelete if needed, 
        // OR just perform the update right here (which is safer since we have the data)
        if (subscription?.user) {
            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: subscription.user.id },
                data: {
                    tier: 'FREE',
                    subscriptionActive: false,
                },
            });
        }
    },
};
