/**
 * event-registration service - Core registration logic
 * Note: Using 'as any' for content type strings until types are regenerated
 */
import { factories } from '@strapi/strapi';

// Content type constant with type assertion
const EVENT_REGISTRATION = 'api::event-registration.event-registration' as any;
const EVENT = 'api::event.event' as any;

interface RegistrationResult {
    id: string;
    registration_status: string;
    waitlist_position?: number;
    message: string;
}

export default factories.createCoreService(
    EVENT_REGISTRATION,
    ({ strapi }) => ({
        /**
         * Register a user for an event
         * Handles capacity checks and waitlist logic
         */
        async registerUser(eventId: string, userId: string): Promise<RegistrationResult> {
            strapi.log.info(`[Event Registration] Starting registration for event ${eventId}, user ${userId}`);

            // 1. Fetch event with capacity info using Document Service or findMany to be safe
            // We need to resolve the Document ID (string) to Internal ID (number) for relations
            const events = await strapi.entityService.findMany(
                EVENT,
                {
                    filters: { documentId: eventId },
                    populate: ['registrations']
                }
            ) as any[];

            const event = events?.[0];

            if (!event) {
                throw new Error('Event not found');
            }

            const eventInternalId = event.id;

            if (!event.isRegistrationOpen) {
                throw new Error('Registration is closed for this event');
            }

            // 2. Check if user already registered
            const existingRegistration = await strapi.entityService.findMany(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventInternalId,
                        user: userId,
                        registration_status: { $in: ['confirmed', 'waitlisted'] }
                    } as any,
                    limit: 1
                }
            ) as any[];

            if (existingRegistration && existingRegistration.length > 0) {
                throw new Error('You are already registered for this event');
            }

            // 3. Count confirmed registrations
            const confirmedCount = await strapi.entityService.count(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventInternalId,
                        registration_status: { $in: ['confirmed', 'attended'] }
                    } as any
                }
            );

            const capacity = event.capacity || 0;
            const hasCapacity = capacity === 0 || confirmedCount < capacity;
            const now = new Date().toISOString();

            // 4. Determine registration status
            if (hasCapacity) {
                // Register as confirmed
                const registration = await strapi.entityService.create(
                    EVENT_REGISTRATION,
                    {
                        data: {
                            event: eventId,
                            user: userId,
                            registration_status: 'confirmed',
                            registered_at: now,
                            confirmed_at: now
                        } as any
                    }
                ) as any;

                // Trigger confirmation notification
                await this.triggerNotification(registration.documentId || registration.id, 'registration_confirmation');

                return {
                    id: registration.documentId || registration.id,
                    registration_status: 'confirmed',
                    message: 'Successfully registered for the event'
                };
            }

            // 5. Check if waitlist is enabled
            if (!event.hasWaitlist) {
                throw new Error('Event is at full capacity and waitlist is not available');
            }

            // 6. Check waitlist capacity
            const waitlistCount = await strapi.entityService.count(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventInternalId,
                        registration_status: { $in: ['waitlisted'] }
                    } as any
                }
            );

            const waitlistCapacity = event.waitlistCapacity || 50;
            if (waitlistCount >= waitlistCapacity) {
                throw new Error('Waitlist is also full');
            }

            // 7. Add to waitlist
            const waitlistPosition = waitlistCount + 1;
            const registration = await strapi.entityService.create(
                EVENT_REGISTRATION,
                {
                    data: {
                        event: eventId,
                        user: userId,
                        registration_status: 'waitlisted',
                        waitlist_position: waitlistPosition,
                        registered_at: now
                    } as any
                }
            ) as any;

            // Trigger waitlist notification
            await this.triggerNotification(registration.documentId || registration.id, 'waitlist_addition');

            return {
                id: registration.documentId || registration.id,
                registration_status: 'waitlisted',
                waitlist_position: waitlistPosition,
                message: `Added to waitlist at position ${waitlistPosition}`
            };
        },

        /**
         * Cancel a registration
         */
        async cancelRegistration(
            registrationId: string,
            userId: string,
            reason?: string
        ): Promise<RegistrationResult> {
            const registration = await strapi.entityService.findOne(
                EVENT_REGISTRATION,
                registrationId,
                { populate: ['user', 'event'] }
            ) as any;

            if (!registration) {
                throw new Error('Registration not found');
            }

            // Verify ownership
            if (registration.user?.id !== userId) {
                throw new Error('You can only cancel your own registration');
            }

            if (registration.registration_status === 'cancelled') {
                throw new Error('Registration is already cancelled');
            }

            const wasConfirmed = registration.registration_status === 'confirmed';
            const eventId = registration.event?.id;

            // Update registration
            await strapi.entityService.update(
                EVENT_REGISTRATION,
                registrationId,
                {
                    data: {
                        registration_status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                        cancellation_reason: reason || null
                    } as any
                }
            );

            // If was confirmed, trigger auto-promotion
            if (wasConfirmed && eventId) {
                await this.autoPromoteFromWaitlist(eventId);
            }

            return {
                id: registrationId,
                registration_status: 'cancelled',
                message: 'Registration cancelled successfully'
            };
        },

        /**
         * Auto-promote from waitlist when a slot opens
         */
        async autoPromoteFromWaitlist(eventId: string): Promise<void> {
            const event = await strapi.entityService.findOne(
                EVENT,
                eventId
            ) as any;

            if (!event?.autoPromoteFromWaitlist) {
                return;
            }

            // Find first waitlisted user
            const waitlisted = await strapi.entityService.findMany(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventId,
                        registration_status: 'waitlisted'
                    } as any,
                    sort: ['waitlist_position:asc'],
                    limit: 1,
                    populate: ['user']
                }
            ) as any[];

            if (!waitlisted || waitlisted.length === 0) {
                return;
            }

            const toPromote = waitlisted[0];
            const now = new Date().toISOString();

            // Promote to confirmed
            await strapi.entityService.update(
                EVENT_REGISTRATION,
                toPromote.id,
                {
                    data: {
                        registration_status: 'confirmed',
                        waitlist_position: null,
                        confirmed_at: now,
                        promoted_from_waitlist_at: now
                    } as any
                }
            );

            // Reorder remaining waitlist
            await this.reorderWaitlist(eventId);

            // Trigger promotion notification
            await this.triggerNotification(toPromote.id, 'waitlist_promotion');
        },

        /**
         * Reorder waitlist positions after changes
         */
        async reorderWaitlist(eventId: string): Promise<void> {
            const waitlisted = await strapi.entityService.findMany(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventId,
                        registration_status: 'waitlisted'
                    } as any,
                    sort: ['waitlist_position:asc']
                }
            ) as any[];

            if (!waitlisted) return;

            for (let i = 0; i < waitlisted.length; i++) {
                await strapi.entityService.update(
                    EVENT_REGISTRATION,
                    waitlisted[i].id,
                    { data: { waitlist_position: i + 1 } as any }
                );
            }
        },

        /**
         * Admin: Manually promote from waitlist
         */
        async adminPromote(registrationId: string): Promise<RegistrationResult> {
            const registration = await strapi.entityService.findOne(
                EVENT_REGISTRATION,
                registrationId
            ) as any;

            if (!registration) {
                throw new Error('Registration not found');
            }

            if (registration.registration_status !== 'waitlisted') {
                throw new Error('Only waitlisted registrations can be promoted');
            }

            const now = new Date().toISOString();

            await strapi.entityService.update(
                EVENT_REGISTRATION,
                registrationId,
                {
                    data: {
                        registration_status: 'confirmed',
                        waitlist_position: null,
                        confirmed_at: now,
                        promoted_from_waitlist_at: now
                    } as any
                }
            );

            // Trigger notification
            await this.triggerNotification(registrationId, 'waitlist_promotion');

            return {
                id: registrationId,
                registration_status: 'confirmed',
                message: 'User promoted from waitlist'
            };
        },

        /**
         * Admin: Manually demote to waitlist
         */
        async adminDemote(registrationId: string): Promise<RegistrationResult> {
            const registration = await strapi.entityService.findOne(
                EVENT_REGISTRATION,
                registrationId,
                { populate: ['event'] }
            ) as any;

            if (!registration) {
                throw new Error('Registration not found');
            }

            if (registration.registration_status !== 'confirmed') {
                throw new Error('Only confirmed registrations can be demoted');
            }

            const eventId = registration.event?.id;
            if (!eventId) {
                throw new Error('Event not found');
            }

            // Get next waitlist position
            const waitlistCount = await strapi.entityService.count(
                EVENT_REGISTRATION,
                {
                    filters: {
                        event: eventId,
                        registration_status: 'waitlisted'
                    } as any
                }
            );

            await strapi.entityService.update(
                EVENT_REGISTRATION,
                registrationId,
                {
                    data: {
                        registration_status: 'waitlisted',
                        waitlist_position: waitlistCount + 1,
                        confirmed_at: null
                    } as any
                }
            );

            return {
                id: registrationId,
                registration_status: 'waitlisted',
                waitlist_position: waitlistCount + 1,
                message: 'User demoted to waitlist'
            };
        },

        /**
         * Mark attendance
         */
        async markAttendance(registrationId: string): Promise<RegistrationResult> {
            const registration = await strapi.entityService.findOne(
                EVENT_REGISTRATION,
                registrationId
            ) as any;

            if (!registration) {
                throw new Error('Registration not found');
            }

            if (!['confirmed', 'attended'].includes(registration.registration_status)) {
                throw new Error('Only confirmed registrations can be marked as attended');
            }

            await strapi.entityService.update(
                EVENT_REGISTRATION,
                registrationId,
                {
                    data: {
                        registration_status: 'attended',
                        attended_at: new Date().toISOString()
                    } as any
                }
            );

            return {
                id: registrationId,
                registration_status: 'attended',
                message: 'Attendance marked'
            };
        },

        /**
         * Get registration counts for an event
         */
        async getRegistrationCounts(eventId: string) {
            // lookup event by documentId first
            const events = await strapi.entityService.findMany(
                EVENT,
                {
                    filters: { documentId: eventId }
                }
            ) as any[];

            const event = events?.[0];

            if (!event) {
                return {
                    confirmed: 0,
                    waitlisted: 0,
                    cancelled: 0,
                    attended: 0,
                    capacity: 0,
                    available: 0
                };
            }

            const eventInternalId = event.id;

            const confirmed = await strapi.entityService.count(
                EVENT_REGISTRATION,
                { filters: { event: eventInternalId, registration_status: 'confirmed' } as any }
            );

            const waitlisted = await strapi.entityService.count(
                EVENT_REGISTRATION,
                { filters: { event: eventInternalId, registration_status: 'waitlisted' } as any }
            );

            const cancelled = await strapi.entityService.count(
                EVENT_REGISTRATION,
                { filters: { event: eventInternalId, registration_status: 'cancelled' } as any }
            );

            const attended = await strapi.entityService.count(
                EVENT_REGISTRATION,
                { filters: { event: eventInternalId, registration_status: 'attended' } as any }
            );

            const capacity = event?.capacity || 0;
            const available = capacity > 0 ? Math.max(0, capacity - confirmed - attended) : null;

            return {
                confirmed,
                waitlisted,
                cancelled,
                attended,
                capacity,
                available
            };
        },

        /**
         * Trigger notification (placeholder - implemented in notification service)
         */
        async triggerNotification(
            registrationId: string,
            notificationType: string
        ): Promise<void> {
            try {
                // This will be implemented in the notification service
                strapi.log.info(`[Notification] Triggering ${notificationType} for registration ${registrationId}`);

                // Queue notification for processing
                // await strapi.service('api::notification.notification').send({
                //     type: notificationType,
                //     registrationId
                // });
            } catch (error) {
                strapi.log.error(`Failed to trigger notification: ${error}`);
            }
        }
    })
);
