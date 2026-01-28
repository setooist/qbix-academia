
import { fetchStrapiAPI } from '@/lib/strapi/client';

export interface NotificationLog {
    id: number;
    attributes: {
        notification_type: string;
        channel: 'email' | 'whatsapp' | 'sms';
        recipient_email?: string;
        recipient_phone?: string;
        subject?: string;
        status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
        sent_at: string;
        error_message?: string;
        template_data?: any;
    }
}

export async function getNotificationLogs(page: number = 1, pageSize: number = 25) {
    return await fetchStrapiAPI('/notification-logs', {
        'sort': 'sent_at:desc',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
    });
}
