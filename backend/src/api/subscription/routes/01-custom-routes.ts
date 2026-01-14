export default {
    routes: [
        {
            method: 'POST',
            path: '/subscription/create-checkout',
            handler: 'subscription.createCheckoutSession',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/subscription/webhook',
            handler: 'subscription.webhook',
            config: {
                auth: false, // Webhook must be public
                policies: [],
                middlewares: [],
            },
        },
    ],
};
