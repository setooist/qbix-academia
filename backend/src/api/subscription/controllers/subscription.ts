/**
 * subscription controller
 */

import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

// Initialize Stripe lazily to avoid startup errors if env var is missing
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing in .env');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-ignore - Using latest Stripe API version
        apiVersion: '2024-12-18.acacia',
    });
};

// @ts-ignore
export default factories.createCoreController('api::subscription.subscription' as any, ({ strapi }) => ({
    // Core CRUD methods - delegate to parent
    async find(ctx) {
        return await super.find(ctx);
    },

    async findOne(ctx) {
        return await super.findOne(ctx);
    },

    async create(ctx) {
        // Create the subscription first
        const response = await super.create(ctx);

        // If subscription was created successfully and has an active status, update user tier
        try {
            const subscriptionData = response?.data;
            const userId = ctx.request.body?.data?.user;
            const subscriptionStatus = ctx.request.body?.data?.subscription_status;

            if (userId && subscriptionStatus === 'active') {
                // Update user's tier to SUBSCRIPTION
                await strapi.db.query('plugin::users-permissions.user').update({
                    where: { id: userId },
                    data: {
                        tier: 'SUBSCRIPTION',
                        subscriptionActive: true,
                    },
                });
            }
        } catch (error) {
            console.error('Failed to update user tier after subscription creation:', error);
        }

        return response;
    },

    async update(ctx) {
        return await super.update(ctx);
    },

    async delete(ctx) {
        return await super.delete(ctx);
    },

    // Custom methods
    async createCheckoutSession(ctx) {
        const { user } = ctx.state;

        if (!user) {
            return ctx.unauthorized('You must be logged in to subscribe');
        }

        try {
            const priceId = process.env.STRIPE_PRICE_ID;
            if (!priceId) {
                throw new Error('STRIPE_PRICE_ID is missing in .env');
            }

            // Create Checkout Session
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const session = await getStripe().checkout.sessions.create({
                ui_mode: 'embedded',
                payment_method_types: ['card'],
                mode: 'subscription',
                customer_email: user.email,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                return_url: `${frontendUrl}/account/subscription?session_id={CHECKOUT_SESSION_ID}`,
                metadata: {
                    userId: user.id,
                },
            });

            return { clientSecret: session.client_secret };


        } catch (error: any) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },

    async webhook(ctx) {
        // We will implement this part next, after verifying creation works
        return { status: 'received' };
    }
}));
