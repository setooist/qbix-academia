/**
 * Analytics service for event registrations
 * Note: Using 'as any' for content type strings until types are regenerated
 */

const EVENT_REGISTRATION = 'api::event-registration.event-registration' as any;
const EVENT = 'api::event.event' as any;

export default {
    /**
     * Get comprehensive analytics for an event
     */
    async getEventAnalytics(eventId: string) {
        const registrations = await this.getAllRegistrations(eventId);
        const event = await strapi.entityService.findOne(EVENT, eventId) as any;

        if (!event) {
            throw new Error('Event not found');
        }

        const confirmed = registrations.filter(
            (r: any) => r.registration_status === 'confirmed'
        );
        const waitlisted = registrations.filter(
            (r: any) => r.registration_status === 'waitlisted'
        );
        const cancelled = registrations.filter(
            (r: any) => r.registration_status === 'cancelled'
        );
        const attended = registrations.filter(
            (r: any) => r.registration_status === 'attended'
        );

        return {
            summary: {
                totalRegistrations: registrations.length,
                confirmed: confirmed.length,
                waitlisted: waitlisted.length,
                cancelled: cancelled.length,
                attended: attended.length,
                capacity: event.capacity || null,
                capacityUtilization: this.calculateCapacityUtilization(
                    confirmed.length + attended.length,
                    event.capacity
                ),
                attendanceRate: this.calculateAttendanceRate(
                    attended.length,
                    confirmed.length + attended.length
                ),
                dropOffRate: this.calculateDropOffRate(
                    cancelled.length,
                    registrations.length
                )
            },
            byRole: this.groupByRole(registrations),
            byTier: this.groupByTier(registrations),
            timeTrends: this.calculateTimeTrends(registrations),
            waitlistMetrics: {
                averagePromotionTime: this.calculateAvgPromotionTime(registrations),
                promotionRate: this.calculatePromotionRate(registrations)
            }
        };
    },

    /**
     * Get all registrations with user data
     */
    async getAllRegistrations(eventId: string): Promise<any[]> {
        // Resolve Document ID if needed
        const events = await strapi.entityService.findMany(
            EVENT,
            {
                filters: { documentId: eventId }
            }
        ) as any[];

        const event = events?.[0];
        if (!event) return [];

        const eventInternalId = event.id;

        const result = await strapi.entityService.findMany(
            EVENT_REGISTRATION,
            {
                filters: { event: eventInternalId },
                populate: {
                    user: {
                        fields: ['id', 'documentId', 'fullName', 'email', 'tier', 'phone'],
                        populate: { role: { fields: ['name', 'type'] } }
                    }
                },
                sort: ['registered_at:asc']
            }
        );
        return Array.isArray(result) ? result : [result];
    },

    /**
     * Calculate capacity utilization percentage
     */
    calculateCapacityUtilization(activeCount: number, capacity: number | null): number | null {
        if (!capacity || capacity === 0) return null;
        return Math.round((activeCount / capacity) * 100);
    },

    /**
     * Calculate attendance rate percentage
     */
    calculateAttendanceRate(attended: number, totalConfirmed: number): number {
        if (totalConfirmed === 0) return 0;
        return Math.round((attended / totalConfirmed) * 100);
    },

    /**
     * Calculate drop-off rate percentage
     */
    calculateDropOffRate(cancelled: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((cancelled / total) * 100);
    },

    /**
     * Group registrations by user role
     */
    groupByRole(registrations: any[]): Record<string, number> {
        const grouped: Record<string, number> = {};

        for (const reg of registrations) {
            const roleName = reg.user?.role?.name || 'Unknown';
            grouped[roleName] = (grouped[roleName] || 0) + 1;
        }

        return grouped;
    },

    /**
     * Group registrations by user tier
     */
    groupByTier(registrations: any[]): Record<string, number> {
        const grouped: Record<string, number> = {};

        for (const reg of registrations) {
            const tier = reg.user?.tier || 'FREE';
            grouped[tier] = (grouped[tier] || 0) + 1;
        }

        return grouped;
    },

    /**
     * Calculate registration time trends (daily counts)
     */
    calculateTimeTrends(registrations: any[]): Record<string, number> {
        const trends: Record<string, number> = {};

        for (const reg of registrations) {
            if (!reg.registered_at) continue;

            const date = new Date(reg.registered_at).toISOString().split('T')[0];
            trends[date] = (trends[date] || 0) + 1;
        }

        return trends;
    },

    /**
     * Calculate average time from waitlist to promotion (in hours)
     */
    calculateAvgPromotionTime(registrations: any[]): number | null {
        const promoted = registrations.filter(
            (r: any) => r.promoted_from_waitlist_at && r.registered_at
        );

        if (promoted.length === 0) return null;

        let totalHours = 0;
        for (const reg of promoted) {
            const waitTime =
                new Date(reg.promoted_from_waitlist_at).getTime() -
                new Date(reg.registered_at).getTime();
            totalHours += waitTime / (1000 * 60 * 60);
        }

        return Math.round(totalHours / promoted.length);
    },

    /**
     * Calculate waitlist promotion rate
     */
    calculatePromotionRate(registrations: any[]): number {
        const waitlisted = registrations.filter(
            (r: any) =>
                r.registration_status === 'waitlisted' ||
                r.promoted_from_waitlist_at
        );

        if (waitlisted.length === 0) return 0;

        const promoted = registrations.filter(
            (r: any) => r.promoted_from_waitlist_at
        );

        return Math.round((promoted.length / waitlisted.length) * 100);
    }
};
