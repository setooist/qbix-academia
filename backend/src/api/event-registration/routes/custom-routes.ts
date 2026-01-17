/**
 * Custom routes for event-registration API
 */
export default {
    routes: [
        // ============ User Routes ============
        {
            method: 'POST',
            path: '/event-registrations/events/:eventId/register',
            handler: 'event-registration.register',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/event-registrations/:id/cancel',
            handler: 'event-registration.cancel',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/event-registrations/events/:eventId/my-registration',
            handler: 'event-registration.getMyRegistration',
            config: {
                policies: [],
                middlewares: []
            }
        },

        // ============ Admin Routes ============
        {
            method: 'POST',
            path: '/admin/event-registrations/:id/promote',
            handler: 'event-registration.adminPromote',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/admin/event-registrations/:id/demote',
            handler: 'event-registration.adminDemote',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/admin/event-registrations/:id/mark-attended',
            handler: 'event-registration.markAttended',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/admin/event-registrations/bulk-attendance',
            handler: 'event-registration.bulkMarkAttended',
            config: {
                policies: [],
                middlewares: []
            }
        },

        // ============ Analytics & Export ============
        {
            method: 'GET',
            path: '/admin/events/:eventId/analytics',
            handler: 'event-registration.getAnalytics',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/admin/events/:eventId/export',
            handler: 'event-registration.exportAttendance',
            config: {
                policies: [],
                middlewares: []
            }
        }
    ]
};
