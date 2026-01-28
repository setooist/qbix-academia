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

// Helper function to extract subscription ID from Invoice
const getSubscriptionIdFromInvoice = (invoice: Stripe.Invoice): string | undefined => {
    // @ts-ignore - Handle subscription being string, object, or null in different Stripe versions
    const sub = invoice.subscription;
    if (typeof sub === 'string') return sub;
    if (sub && typeof sub === 'object' && 'id' in sub) return sub.id;
    return undefined;
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

        // If subscription was created successfully and has an active status, update studentProfile
        try {
            const studentProfileId = ctx.request.body?.data?.studentProfile;
            const subscriptionStatus = ctx.request.body?.data?.subscription_status;

            if (studentProfileId && subscriptionStatus === 'active') {
                // Update studentProfile's subscription status
                await strapi.db.query('api::student-profile.student-profile').update({
                    where: { id: studentProfileId },
                    data: {
                        subscriptionActive: true,
                    },
                });

                // Also get the user from studentProfile and update their tier
                const profile = await strapi.db.query('api::student-profile.student-profile').findOne({
                    where: { id: studentProfileId },
                    populate: ['user'],
                });

                if (profile?.user?.id) {
                    await strapi.db.query('plugin::users-permissions.user').update({
                        where: { id: profile.user.id },
                        data: {
                            tier: 'SUBSCRIPTION',
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Failed to update studentProfile after subscription creation:', error);
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

        const userId = user.id;

        try {
            const priceId = process.env.STRIPE_PRICE_ID;
            if (!priceId) {
                throw new Error('STRIPE_PRICE_ID is missing in .env');
            }

            // Create Checkout Session
            const stripe = getStripe();
            const session = await stripe.checkout.sessions.create({
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
                redirect_on_completion: 'never',
                metadata: {
                    userId: String(user.id),
                },
                subscription_data: {
                    metadata: {
                        userId: String(user.id),
                    },
                },
            });
            const now = new Date();
            const oneMonthLater = new Date(now);
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            await strapi.db.query('api::subscription.subscription').create({
                data: {
                    stripeSubscriptionId: session.id, // Use Session ID temporarily until webhook updates it
                    subscription_status: 'active',
                    user: userId,
                    start_date: now.toISOString(),
                    end_date: oneMonthLater.toISOString(),
                },
            });

            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: userId },
                data: {
                    tier: 'SUBSCRIPTION',
                    subscriptionActive: true,
                },
            });

            return { clientSecret: session.client_secret };


        } catch (error: any) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },

    async webhook(ctx) {
        const stripe = getStripe();
        const sig = ctx.request.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event: Stripe.Event;

        try {
            const unparsedBody = ctx.request.body?.[Symbol.for('unparsedBody')];
            const rawBody = unparsedBody || ctx.request.body;
            if (webhookSecret && sig) {
                event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
            } else {
                event = ctx.request.body as Stripe.Event;
            }
        } catch (err: any) {
            ctx.response.status = 400;
            return { error: `Webhook Error: ${err.message}` };
        }
        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object;
                    await handleCheckoutCompleted(strapi, session);
                    break;
                }

                case 'customer.subscription.updated': {
                    const subscription = event.data.object;
                    await handleSubscriptionUpdated(strapi, subscription);
                    break;
                }

                case 'customer.subscription.deleted': {
                    const subscription = event.data.object;
                    await handleSubscriptionDeleted(strapi, subscription);
                    break;
                }

                case 'invoice.payment_failed': {
                    const invoice = event.data.object;
                    await handlePaymentFailed(strapi, invoice);
                    break;
                }

                default:
            }

            return { received: true };
        } catch (error: any) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
}));

// Helper methods for webhook handling - defined outside the controller to avoid 'this' context issues
async function handleCheckoutCompleted(strapi: any, session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId) {
        return;
    }

    const stripe = getStripe();
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    // @ts-ignore - Handle different Stripe SDK versions
    const currentPeriodStart = stripeSubscription.current_period_start;
    // @ts-ignore - Handle different Stripe SDK versions
    const currentPeriodEnd = stripeSubscription.current_period_end;

    // Helper to safely parse date
    const safeDate = (timestamp: number | undefined | null) => {
        if (!timestamp) return new Date();
        const date = new Date(timestamp * 1000);
        return Number.isNaN(date.getTime()) ? new Date() : date;
    };

    const startDateObj = safeDate(currentPeriodStart);
    const endDateObj = safeDate(currentPeriodEnd);

    let existingSub = await strapi.db.query('api::subscription.subscription').findOne({
        where: { stripeSubscriptionId },
    });

    // Fallback: Check for optimistic record using Session ID
    if (!existingSub) {
        existingSub = await strapi.db.query('api::subscription.subscription').findOne({
            where: { stripeSubscriptionId: session.id },
        });
    }

    if (existingSub) {
        await strapi.db.query('api::subscription.subscription').update({
            where: { id: existingSub.id },
            data: {
                stripeSubscriptionId: stripeSubscriptionId, // Ensure we replace Session ID with real Subscription ID
                subscription_status: stripeSubscription.status === 'active' ? 'active' : stripeSubscription.status,
                start_date: startDateObj.toISOString(),
                end_date: endDateObj.toISOString(),
            },
        });
    } else {
        try {
            await strapi.db.query('api::subscription.subscription').create({
                data: {
                    stripeSubscriptionId,
                    subscription_status: 'active',
                    user: userId,
                    start_date: startDateObj.toISOString(),
                    end_date: endDateObj.toISOString(),
                },
            });
        } catch (error) {
            console.error('[handleCheckoutCompleted] Failed to create subscription record:', error);
        }
    }

    await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: {
            tier: 'SUBSCRIPTION',
            subscriptionActive: true,
        },
    });
}

async function handleSubscriptionUpdated(strapi: any, subscription: Stripe.Subscription) {
    const stripeSubscriptionId = subscription.id;
    const existingSub = await strapi.db.query('api::subscription.subscription').findOne({
        where: { stripeSubscriptionId },
        populate: ['user'],
    });

    if (!existingSub) {
        return;
    }

    // Map Stripe status to our enum
    let status: 'active' | 'canceled' | 'past_due' | 'trialing' = 'active';
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        status = 'canceled';
    } else if (subscription.status === 'past_due') {
        status = 'past_due';
    } else if (subscription.status === 'trialing') {
        status = 'trialing';
    }

    // @ts-ignore - Handle different Stripe SDK versions
    const currentPeriodEnd = subscription.current_period_end;

    await strapi.db.query('api::subscription.subscription').update({
        where: { id: existingSub.id },
        data: {
            subscription_status: status,
            end_date: new Date(currentPeriodEnd * 1000).toISOString(),
        },
    });

    // Update user tier based on status
    if (existingSub.user?.id) {
        const isActive = status === 'active' || status === 'trialing';
        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: existingSub.user.id },
            data: {
                tier: isActive ? 'SUBSCRIPTION' : 'FREE',
                subscriptionActive: isActive,
            },
        });
    }
}

async function handleSubscriptionDeleted(strapi: any, subscription: Stripe.Subscription) {
    const stripeSubscriptionId = subscription.id;
    const existingSub = await strapi.db.query('api::subscription.subscription').findOne({
        where: { stripeSubscriptionId },
        populate: ['user'],
    });

    if (existingSub) {
        await strapi.db.query('api::subscription.subscription').update({
            where: { id: existingSub.id },
            data: {
                subscription_status: 'canceled',
            },
        });
    } else {
        console.warn(`Subscription ${stripeSubscriptionId} not found in Strapi. Checking metadata for user cleanup...`);
    }

    // Downgrade user tier - Use ID from existing record OR directly from Stripe metadata
    const userId = existingSub?.user?.id || subscription.metadata?.userId;

    if (userId) {
        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: userId },
            data: {
                tier: 'FREE',
                subscriptionActive: false,
            },
        });
    }
}

async function handlePaymentFailed(strapi: any, invoice: Stripe.Invoice) {
    const subscriptionId = getSubscriptionIdFromInvoice(invoice);
    if (!subscriptionId) return;

    const existingSub = await strapi.db.query('api::subscription.subscription').findOne({
        where: { stripeSubscriptionId: subscriptionId },
        populate: ['user'],
    });

    if (existingSub) {
        await strapi.db.query('api::subscription.subscription').update({
            where: { id: existingSub.id },
            data: {
                subscription_status: 'past_due',
            },
        });
    }
}
