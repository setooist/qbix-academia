/**
 * Feedback Service - Handles post-event feedback requests
 */
export default {
    /**
     * Send feedback requests for events that ended at target time
     * @param targetTime - The datetime when events ended (typically T-24h)
     */
    async sendFeedbackRequests(targetTime: Date): Promise<void> {
        // Calculate time window (1 hour window)
        const windowStart = new Date(targetTime.getTime() - 30 * 60 * 1000);
        const windowEnd = new Date(targetTime.getTime() + 30 * 60 * 1000);

        try {
            // Find events that ended in the target time window
            const events = await strapi.entityService.findMany(
                'api::event.event' as any,
                {
                    filters: {
                        endDateTime: {
                            $gte: windowStart.toISOString(),
                            $lte: windowEnd.toISOString()
                        }
                    }
                }
            );

            const eventList = Array.isArray(events) ? events : [events];

            for (const event of eventList) {
                // Get attended registrations for this event
                const registrations = await strapi.entityService.findMany(
                    'api::event-registration.event-registration' as any,
                    {
                        filters: {
                            event: (event as any).id,
                            registration_status: 'attended'
                        },
                        populate: ['user']
                    }
                );

                const regList = Array.isArray(registrations) ? registrations : [registrations];

                for (const registration of regList) {
                    // Check if we already sent feedback request
                    const alreadySent = await this.hasFeedbackRequestBeenSent(
                        (registration as any).id
                    );

                    if (alreadySent) {
                        continue;
                    }

                    // Send feedback request notification
                    try {
                        await strapi.service('api::notification.notification-service').send({
                            type: 'post_event_feedback',
                            channel: 'email',
                            registrationId: (registration as any).id
                        });

                        strapi.log.info(
                            `[Feedback] Sent feedback request for event ${(event as any).id} to registration ${(registration as any).id}`
                        );
                    } catch (error) {
                        strapi.log.error(
                            `[Feedback] Failed to send feedback request:`,
                            error
                        );
                    }
                }
            }
        } catch (error) {
            strapi.log.error('[Feedback] Error in sendFeedbackRequests:', error);
        }
    },

    /**
     * Check if a feedback request has already been sent
     */
    async hasFeedbackRequestBeenSent(registrationId: string): Promise<boolean> {
        const existing = await strapi.entityService.findMany(
            'api::notification-log.notification-log' as any,
            {
                filters: {
                    notification_type: 'post_event_feedback',
                    event_registration: registrationId,
                    status: { $in: ['sent', 'delivered'] }
                },
                limit: 1
            }
        );

        return Array.isArray(existing) ? existing.length > 0 : false;
    }
};
