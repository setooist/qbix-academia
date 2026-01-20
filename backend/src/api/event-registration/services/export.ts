/**
 * Export service for event registration data
 * Note: Using 'as any' for content type strings until types are regenerated
 */

const EVENT_REGISTRATION = 'api::event-registration.event-registration' as any;
const EVENT = 'api::event.event' as any;

export default {
    /**
     * Export attendance data as CSV
     */
    async exportAsCSV(eventId: string): Promise<string> {
        const registrations = await this.getRegistrationsWithUserData(eventId);

        // Find event by Document ID
        const events = await strapi.entityService.findMany(EVENT, {
            filters: { documentId: eventId }
        }) as any[];

        const event = events?.[0];

        if (!event) {
            throw new Error('Event not found');
        }

        const regList = Array.isArray(registrations) ? registrations : [];

        // CSV Header
        const headers = [
            'Name',
            'Email',
            'Phone',
            'Role',
            'Tier',
            'Status',
            'Waitlist Position',
            'Registered At',
            'Confirmed At',
            'Attended At',
            'Cancelled At',
            'Cancellation Reason'
        ];

        // Build rows
        const rows = regList.map((reg: any) => [
            this.escapeCSV(reg.user?.fullName || ''),
            this.escapeCSV(reg.user?.email || ''),
            this.escapeCSV(reg.user?.phone || ''),
            this.escapeCSV(reg.user?.role?.name || ''),
            this.escapeCSV(reg.user?.tier || 'FREE'),
            this.escapeCSV(reg.registration_status || ''),
            reg.waitlist_position || '',
            this.formatDate(reg.registered_at),
            this.formatDate(reg.confirmed_at),
            this.formatDate(reg.attended_at),
            this.formatDate(reg.cancelled_at),
            this.escapeCSV(reg.cancellation_reason || '')
        ]);

        // Combine header and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    },

    /**
     * Export attendance data as XLSX
     * Requires exceljs package to be installed
     */
    async exportAsXLSX(eventId: string): Promise<Buffer> {
        try {
            // Dynamic import to handle optional dependency
            const ExcelJS = await import('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Registrations');

            const registrations = await this.getRegistrationsWithUserData(eventId);

            // Find event by Document ID
            const events = await strapi.entityService.findMany(EVENT, {
                filters: { documentId: eventId }
            }) as any[];

            const event = events?.[0];

            if (!event) {
                throw new Error('Event not found');
            }

            const regList = Array.isArray(registrations) ? registrations : [];

            // Add headers
            worksheet.columns = [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'Role', key: 'role', width: 15 },
                { header: 'Tier', key: 'tier', width: 10 },
                { header: 'Status', key: 'status', width: 12 },
                { header: 'Waitlist Position', key: 'waitlist_position', width: 15 },
                { header: 'Registered At', key: 'registered_at', width: 20 },
                { header: 'Confirmed At', key: 'confirmed_at', width: 20 },
                { header: 'Attended At', key: 'attended_at', width: 20 },
                { header: 'Cancelled At', key: 'cancelled_at', width: 20 },
                { header: 'Cancellation Reason', key: 'cancellation_reason', width: 30 }
            ];

            // Style header row
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3B82F6' }
            };
            worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

            // Add data rows
            for (const reg of regList) {
                worksheet.addRow({
                    name: reg.user?.fullName || '',
                    email: reg.user?.email || '',
                    phone: reg.user?.phone || '',
                    role: reg.user?.role?.name || '',
                    tier: reg.user?.tier || 'FREE',
                    status: reg.registration_status || '',
                    waitlist_position: reg.waitlist_position || '',
                    registered_at: this.formatDate(reg.registered_at),
                    confirmed_at: this.formatDate(reg.confirmed_at),
                    attended_at: this.formatDate(reg.attended_at),
                    cancelled_at: this.formatDate(reg.cancelled_at),
                    cancellation_reason: reg.cancellation_reason || ''
                });
            }

            // Add status-based row coloring
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const status = row.getCell('status').value;
                    let bgColor = 'FFFFFFFF';

                    if (status === 'attended') bgColor = 'FFD1FAE5';
                    else if (status === 'confirmed') bgColor = 'FFDBEAFE';
                    else if (status === 'waitlisted') bgColor = 'FFFEF3C7';
                    else if (status === 'cancelled') bgColor = 'FFFEE2E2';

                    row.eachCell((cell) => {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: bgColor }
                        };
                    });
                }
            });

            // Generate buffer
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer as unknown as Buffer;

        } catch (error: any) {
            if (error.code === 'MODULE_NOT_FOUND') {
                throw new Error('XLSX export requires exceljs package. Please install it with: npm install exceljs');
            }
            throw error;
        }
    },

    /**
     * Get registrations with full user data
     */
    async getRegistrationsWithUserData(eventId: string): Promise<any[]> {
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
                        fields: ['fullName', 'email', 'tier', 'phone'],
                        populate: { role: { fields: ['name', 'type'] } }
                    }
                },
                sort: ['registered_at:asc']
            }
        );
        return Array.isArray(result) ? result : [result];
    },

    /**
     * Escape CSV field
     */
    escapeCSV(value: string): string {
        if (!value) return '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    },

    /**
     * Format date for export
     */
    formatDate(dateString: string | null): string {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    }
};
