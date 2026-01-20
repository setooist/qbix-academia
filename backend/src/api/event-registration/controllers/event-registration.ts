/**
 * event-registration controller
 * Note: Using 'as any' for content type strings until types are regenerated
 */
import { factories } from '@strapi/strapi';

// Content type constant with type assertion
const EVENT_REGISTRATION = 'api::event-registration.event-registration' as any;

export default factories.createCoreController(
    EVENT_REGISTRATION,
    ({ strapi }) => ({
        /**
         * Register current user for an event
         */
        async register(ctx) {
            const { eventId } = ctx.params;
            const userId = ctx.state.user?.id;

            if (!userId) {
                return ctx.unauthorized('You must be logged in to register');
            }

            try {
                const result = await strapi
                    .service('api::event-registration.event-registration')
                    .registerUser(eventId, userId);

                return ctx.send(result);
            } catch (error: any) {
                strapi.log.error('Registration failed:', error);
                return ctx.badRequest(error.message || 'Registration failed');
            }
        },

        /**
         * Cancel current user's registration
         */
        async cancel(ctx) {
            const { id } = ctx.params;
            const userId = ctx.state.user?.id;
            const { reason } = ctx.request.body || {};

            try {
                const result = await strapi
                    .service('api::event-registration.event-registration')
                    .cancelRegistration(id, userId, reason);

                return ctx.send(result);
            } catch (error: any) {
                strapi.log.error('Cancellation failed:', error);
                return ctx.badRequest(error.message || 'Cancellation failed');
            }
        },

        /**
         * Admin: Promote user from waitlist
         */
        async adminPromote(ctx) {
            const { id } = ctx.params;

            try {
                const result = await strapi
                    .service('api::event-registration.event-registration')
                    .adminPromote(id);

                return ctx.send(result);
            } catch (error: any) {
                strapi.log.error('Promotion failed:', error);
                return ctx.badRequest(error.message || 'Promotion failed');
            }
        },

        /**
         * Admin: Demote user to waitlist
         */
        async adminDemote(ctx) {
            const { id } = ctx.params;

            try {
                const result = await strapi
                    .service('api::event-registration.event-registration')
                    .adminDemote(id);

                return ctx.send(result);
            } catch (error: any) {
                strapi.log.error('Demotion failed:', error);
                return ctx.badRequest(error.message || 'Demotion failed');
            }
        },

        /**
         * Admin: Mark attendance
         */
        async markAttended(ctx) {
            const { id } = ctx.params;

            try {
                const result = await strapi
                    .service('api::event-registration.event-registration')
                    .markAttendance(id);

                return ctx.send(result);
            } catch (error: any) {
                strapi.log.error('Mark attendance failed:', error);
                return ctx.badRequest(error.message || 'Mark attendance failed');
            }
        },

        /**
         * Admin: Bulk mark attendance
         */
        async bulkMarkAttended(ctx) {
            const { registrationIds } = ctx.request.body || {};

            if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
                return ctx.badRequest('registrationIds array is required');
            }

            try {
                const results = await Promise.all(
                    registrationIds.map((id: string) =>
                        strapi
                            .service('api::event-registration.event-registration')
                            .markAttendance(id)
                    )
                );

                return ctx.send({ success: true, updated: results.length });
            } catch (error: any) {
                strapi.log.error('Bulk mark attendance failed:', error);
                return ctx.badRequest(error.message || 'Bulk mark attendance failed');
            }
        },

        /**
         * Admin: Get event analytics
         */
        async getAnalytics(ctx) {
            const { eventId } = ctx.params;

            try {
                const analytics = await strapi
                    .service('api::event-registration.analytics')
                    .getEventAnalytics(eventId);

                return ctx.send(analytics);
            } catch (error: any) {
                strapi.log.error('Get analytics failed:', error);
                return ctx.badRequest(error.message || 'Failed to get analytics');
            }
        },

        /**
         * Admin: Export attendance data
         */
        async exportAttendance(ctx) {
            const { eventId } = ctx.params;
            const { format = 'csv' } = ctx.query;

            try {
                const exportService = strapi.service('api::event-registration.export');

                if (format === 'xlsx') {
                    const buffer = await exportService.exportAsXLSX(eventId);
                    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    ctx.set('Content-Disposition', `attachment; filename=event-${eventId}-attendance.xlsx`);
                    return ctx.send(buffer);
                }

                const csv = await exportService.exportAsCSV(eventId);
                ctx.set('Content-Type', 'text/csv');
                ctx.set('Content-Disposition', `attachment; filename=event-${eventId}-attendance.csv`);
                return ctx.send(csv);

            } catch (error: any) {
                strapi.log.error('Export failed:', error);
                return ctx.badRequest(error.message || 'Export failed');
            }
        },

        /**
         * Get current user's registration for an event
         */
        async getMyRegistration(ctx) {
            const { eventId } = ctx.params;
            const userId = ctx.state.user?.id;

            if (!userId) {
                return ctx.unauthorized('You must be logged in');
            }

            try {
                const registration = await strapi.entityService.findMany(
                    EVENT_REGISTRATION,
                    {
                        filters: {
                            event: { documentId: eventId },
                            user: userId,
                            registration_status: { $ne: 'cancelled' }
                        } as any,
                        limit: 1,
                        populate: ['event']
                    }
                ) as any[];

                return ctx.send(registration?.[0] || null);
            } catch (error: any) {
                strapi.log.error('Get registration failed:', error);
                return ctx.badRequest(error.message || 'Failed to get registration');
            }
        }
    })
);
