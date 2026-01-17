/**
 * Reminder Service - Handles scheduled event reminders
 */
export default {
    /**
     * Send reminders for events happening at target time
     * @param reminderType - Type of reminder (72h, 24h, 4h)
     * @param targetTime - The datetime when events should start
     */
    async sendReminders(reminderType: '72h' | '24h' | '4h', targetTime: Date): Promise<void> {
        const notificationType = `reminder_${reminderType}` as const;

        // Calculate time window (1 hour window)
        const windowStart = new Date(targetTime.getTime() - 30 * 60 * 1000);
        const windowEnd = new Date(targetTime.getTime() + 30 * 60 * 1000);

        try {
            // Find events starting in the target time window
            const events = await strapi.entityService.findMany(
                'api::event.event' as any,
                {
                    filters: {
                        startDateTime: {
                            $gte: windowStart.toISOString(),
                            $lte: windowEnd.toISOString()
                        },
                        eventStatus: { $in: ['Published', 'Registration Open'] }
                    },
                    populate: ['registrations']
                }
            );

            const eventList = Array.isArray(events) ? events : [events];

            for (const event of eventList) {
                // Check if this reminder is enabled for the event
                const reminderSchedule = (event as any).reminderSchedule || { '72h': true, '24h': true, '4h': true };
                if (!reminderSchedule[reminderType]) {
                    continue;
                }

                // Get confirmed registrations for this event
                const registrations = await strapi.entityService.findMany(
                    'api::event-registration.event-registration' as any,
                    {
                        filters: {
                            event: (event as any).id,
                            registration_status: { $in: ['confirmed', 'attended'] }
                        },
                        populate: ['user']
                    }
                );

                const regList = Array.isArray(registrations) ? registrations : [registrations];

                // Check if we already sent this reminder (avoid duplicates)
                for (const registration of regList) {
                    const alreadySent = await this.hasNotificationBeenSent(
                        notificationType,
                        (registration as any).id
                    );

                    if (alreadySent) {
                        continue;
                    }

                    // Send reminder notification
                    try {
                        await strapi.service('api::notification.notification-service').send({
                            type: notificationType,
                            channel: 'email',
                            registrationId: (registration as any).id
                        });

                        strapi.log.info(
                            `[Reminder] Sent ${reminderType} reminder for event ${(event as any).id} to registration ${(registration as any).id}`
                        );
                    } catch (error) {
                        strapi.log.error(
                            `[Reminder] Failed to send ${reminderType} reminder:`,
                            error
                        );
                    }
                }
            }
        } catch (error) {
            strapi.log.error(`[Reminder] Error in sendReminders for ${reminderType}:`, error);
        }
    },

    /**
     * Check if a notification has already been sent
     */
    async hasNotificationBeenSent(
        notificationType: string,
        registrationId: string
    ): Promise<boolean> {
        const existing = await strapi.entityService.findMany(
            'api::notification-log.notification-log' as any,
            {
                filters: {
                    notification_type: notificationType,
                    event_registration: registrationId,
                    status: { $in: ['sent', 'delivered'] }
                },
                limit: 1
            }
        );

        return Array.isArray(existing) ? existing.length > 0 : false;
    }
};
