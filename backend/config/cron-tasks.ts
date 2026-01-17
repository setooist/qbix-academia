/**
 * Cron Tasks Configuration
 * Handles scheduled tasks for event reminders and notifications
 */
export default {
    /**
     * Event Reminder Cron Job
     * Runs every hour to check for events needing reminders
     * Cron pattern: At minute 0 of every hour
     */
    '0 * * * *': async ({ strapi }: { strapi: any }) => {
        strapi.log.info('[Cron] Running event reminder check...');

        const now = new Date();

        try {
            // 72-hour reminder (3 days ahead)
            const target72h = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            await strapi.service('api::notification.reminder-service')?.sendReminders('72h', target72h);

            // 24-hour reminder (1 day ahead)
            const target24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            await strapi.service('api::notification.reminder-service')?.sendReminders('24h', target24h);

            // 4-hour reminder
            const target4h = new Date(now.getTime() + 4 * 60 * 60 * 1000);
            await strapi.service('api::notification.reminder-service')?.sendReminders('4h', target4h);

            strapi.log.info('[Cron] Event reminder check completed');

        } catch (error) {
            strapi.log.error('[Cron] Event reminder check failed:', error);
        }
    },

    /**
     * Post-Event Feedback Cron Job
     * Runs every hour to send feedback requests for events that ended 24h ago
     * Cron pattern: At minute 30 of every hour
     */
    '30 * * * *': async ({ strapi }: { strapi: any }) => {
        strapi.log.info('[Cron] Running post-event feedback check...');

        try {
            // Events that ended 24 hours ago
            const target = new Date(Date.now() - 24 * 60 * 60 * 1000);
            await strapi.service('api::notification.feedback-service')?.sendFeedbackRequests(target);

            strapi.log.info('[Cron] Post-event feedback check completed');

        } catch (error) {
            strapi.log.error('[Cron] Post-event feedback check failed:', error);
        }
    }
};
