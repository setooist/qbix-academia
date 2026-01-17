/**
 * Notification Service - Provider-agnostic notification sending
 */

type NotificationType =
    | 'registration_confirmation'
    | 'waitlist_addition'
    | 'waitlist_promotion'
    | 'reminder_72h'
    | 'reminder_24h'
    | 'reminder_4h'
    | 'event_update'
    | 'event_cancellation'
    | 'post_event_feedback';

type NotificationChannel = 'email' | 'whatsapp' | 'sms';

interface NotificationPayload {
    type: NotificationType;
    channel?: NotificationChannel;
    registrationId?: string;
    eventId?: string;
    userId?: string;
    data?: Record<string, any>;
}

interface TemplateData {
    userName?: string;
    eventTitle?: string;
    eventDate?: string;
    eventTime?: string;
    eventLink?: string;
    meetingLink?: string;
    waitlistPosition?: number;
    [key: string]: any;
}

export default {
    /**
     * Send notification to a user
     */
    async send(payload: NotificationPayload): Promise<void> {
        const { type, channel = 'email', registrationId, eventId, userId, data = {} } = payload;

        try {
            // Get registration with user and event data
            let registration: any = null;
            let user: any = null;
            let event: any = null;

            if (registrationId) {
                registration = await strapi.entityService.findOne(
                    'api::event-registration.event-registration' as any,
                    registrationId,
                    {
                        populate: {
                            user: { fields: ['id', 'email', 'fullName', 'phone'] },
                            event: { fields: ['id', 'title', 'startDateTime', 'timezone', 'meetingLink'] }
                        }
                    }
                );
                user = registration?.user;
                event = registration?.event;
            }

            if (!user && userId) {
                user = await strapi.entityService.findOne(
                    'plugin::users-permissions.user' as any,
                    userId,
                    { fields: ['id', 'email', 'fullName', 'phone'] }
                );
            }

            if (!event && eventId) {
                event = await strapi.entityService.findOne(
                    'api::event.event' as any,
                    eventId,
                    { fields: ['id', 'title', 'startDateTime', 'timezone', 'meetingLink'] }
                );
            }

            if (!user) {
                strapi.log.warn(`[Notification] No user found for notification: ${type}`);
                return;
            }

            // Check user notification preferences
            const preferences = registration?.notification_preferences || { email: true, whatsapp: false };
            if (channel === 'email' && !preferences.email) {
                strapi.log.info(`[Notification] User has disabled email notifications`);
                return;
            }
            if (channel === 'whatsapp' && !preferences.whatsapp) {
                strapi.log.info(`[Notification] User has disabled WhatsApp notifications`);
                return;
            }

            // Get template
            const template = await this.getTemplate(type, channel);
            if (!template) {
                strapi.log.warn(`[Notification] No template found for ${type} on ${channel}`);
                // Use fallback/default template
            }

            // Prepare template data
            const templateData: TemplateData = {
                userName: user.fullName || user.username || 'User',
                eventTitle: event?.title || 'Event',
                eventDate: event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                    : '',
                eventTime: event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                    })
                    : '',
                eventLink: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/events/${event?.slug || event?.id}`,
                meetingLink: event?.meetingLink || '',
                waitlistPosition: registration?.waitlist_position || 0,
                ...data
            };

            // Send notification
            if (channel === 'email') {
                await this.sendEmail(
                    user.email,
                    template ? this.renderTemplate(template.subject, templateData) : this.getDefaultSubject(type, templateData),
                    template ? this.renderTemplate(template.html_body, templateData) : this.getDefaultHtml(type, templateData),
                    template ? this.renderTemplate(template.text_body, templateData) : ''
                );
            } else if (channel === 'whatsapp') {
                await this.sendWhatsApp(user.phone, type, templateData);
            }

            // Log notification
            await this.logNotification({
                notification_type: type,
                channel,
                recipient_email: user.email,
                recipient_phone: user.phone,
                user: user.id,
                event: event?.id,
                event_registration: registration?.id,
                status: 'sent',
                sent_at: new Date().toISOString(),
                template_key: template?.template_key || 'default',
                template_data: templateData
            });

            strapi.log.info(`[Notification] Sent ${type} via ${channel} to ${user.email}`);

        } catch (error: any) {
            strapi.log.error(`[Notification] Failed to send ${type}:`, error);

            // Log failed notification
            await this.logNotification({
                notification_type: type,
                channel: channel,
                status: 'failed',
                error_message: error.message || 'Unknown error',
                template_data: data
            });

            throw error;
        }
    },

    /**
     * Get notification template
     */
    async getTemplate(type: NotificationType, channel: NotificationChannel) {
        const templates = await strapi.entityService.findMany(
            'api::notification-template.notification-template' as any,
            {
                filters: {
                    notification_type: type,
                    channel: channel,
                    is_active: true
                },
                limit: 1
            }
        );

        return Array.isArray(templates) && templates.length > 0 ? templates[0] : null;
    },

    /**
     * Send email notification
     */
    async sendEmail(to: string, subject: string, html: string, text?: string) {
        return strapi.plugin('email').service('email').send({
            to,
            subject,
            html,
            text: text || ''
        });
    },

    /**
     * Send WhatsApp notification (placeholder for future integration)
     */
    async sendWhatsApp(to: string, templateId: string, data: object) {
        // This is a placeholder for WhatsApp Business API integration
        strapi.log.info(`[WhatsApp] Notification queued for ${to}`, { templateId, data });
        // TODO: Implement WhatsApp Business API integration
        // Options: Twilio, MessageBird, Meta Cloud API
        return { success: true, message: 'WhatsApp notification queued' };
    },

    /**
     * Render template with variable substitution
     */
    renderTemplate(template: string, data: TemplateData): string {
        if (!template) return '';
        // Replace all {{variable}} patterns with actual data values
        let result = template;
        for (const [key, value] of Object.entries(data)) {
            // Using split/join for broader compatibility
            result = result.split(`{{${key}}}`).join(String(value ?? ''));
        }
        return result;
    },

    /**
     * Log notification to database
     */
    async logNotification(logData: Record<string, any>) {
        try {
            await strapi.entityService.create(
                'api::notification-log.notification-log' as any,
                { data: logData }
            );
        } catch (error) {
            strapi.log.error('[Notification] Failed to log notification:', error);
        }
    },

    /**
     * Get default subject for notification type
     */
    getDefaultSubject(type: NotificationType, data: TemplateData): string {
        const subjects: Record<NotificationType, string> = {
            registration_confirmation: `Registration Confirmed: ${data.eventTitle}`,
            waitlist_addition: `Waitlist Confirmation: ${data.eventTitle}`,
            waitlist_promotion: `Great News! You're Confirmed: ${data.eventTitle}`,
            reminder_72h: `Reminder: ${data.eventTitle} in 3 Days`,
            reminder_24h: `Tomorrow: ${data.eventTitle}`,
            reminder_4h: `Starting Soon: ${data.eventTitle}`,
            event_update: `Update: ${data.eventTitle}`,
            event_cancellation: `Cancelled: ${data.eventTitle}`,
            post_event_feedback: `How was ${data.eventTitle}?`
        };
        return subjects[type] || `Notification: ${data.eventTitle}`;
    },

    /**
     * Get default HTML template for notification type
     */
    getDefaultHtml(type: NotificationType, data: TemplateData): string {
        const baseStyle = `
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        `;

        const cardStyle = `
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
        `;

        const headerStyle = `
            background: linear-gradient(135deg, #3b82f6, #f97316);
            padding: 20px;
            color: #fff;
        `;

        const contentStyle = `padding: 20px;`;

        const buttonStyle = `
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #3b82f6;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
        `;

        const templates: Record<NotificationType, string> = {
            registration_confirmation: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>🎉 Registration Confirmed!</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>You're all set! Your registration for <strong>${data.eventTitle}</strong> has been confirmed.</p>
                            <p><strong>Date:</strong> ${data.eventDate}</p>
                            <p><strong>Time:</strong> ${data.eventTime}</p>
                            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event Details</a>
                        </div>
                    </div>
                </div>
            `,
            waitlist_addition: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>⏳ You're on the Waitlist</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>You've been added to the waitlist for <strong>${data.eventTitle}</strong>.</p>
                            <p>Your waitlist position: <strong>#${data.waitlistPosition}</strong></p>
                            <p>We'll notify you immediately if a spot opens up!</p>
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event</a>
                        </div>
                    </div>
                </div>
            `,
            waitlist_promotion: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>🎊 Great News!</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>A spot opened up! Your registration for <strong>${data.eventTitle}</strong> is now <strong>confirmed</strong>.</p>
                            <p><strong>Date:</strong> ${data.eventDate}</p>
                            <p><strong>Time:</strong> ${data.eventTime}</p>
                            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event Details</a>
                        </div>
                    </div>
                </div>
            `,
            reminder_72h: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>📅 Event Reminder - 3 Days</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p><strong>${data.eventTitle}</strong> is happening in 3 days!</p>
                            <p><strong>Date:</strong> ${data.eventDate}</p>
                            <p><strong>Time:</strong> ${data.eventTime}</p>
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event Details</a>
                        </div>
                    </div>
                </div>
            `,
            reminder_24h: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>⏰ Tomorrow: ${data.eventTitle}</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>Just a reminder: <strong>${data.eventTitle}</strong> is happening tomorrow!</p>
                            <p><strong>Time:</strong> ${data.eventTime}</p>
                            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event</a>
                        </div>
                    </div>
                </div>
            `,
            reminder_4h: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>🚀 Starting Soon!</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p><strong>${data.eventTitle}</strong> starts in about 4 hours!</p>
                            ${data.meetingLink ? `<p><strong>Join here:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
                            <a href="${data.eventLink}" style="${buttonStyle}">View Event</a>
                        </div>
                    </div>
                </div>
            `,
            event_update: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>📢 Event Update</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>There has been an update to <strong>${data.eventTitle}</strong>.</p>
                            <p>Please check the event page for the latest details.</p>
                            <a href="${data.eventLink}" style="${buttonStyle}">View Updated Details</a>
                        </div>
                    </div>
                </div>
            `,
            event_cancellation: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}; background: linear-gradient(135deg, #ef4444, #f97316);">
                            <h2>❌ Event Cancelled</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>We regret to inform you that <strong>${data.eventTitle}</strong> has been cancelled.</p>
                            <p>We apologize for any inconvenience. Please check our events page for other upcoming events.</p>
                        </div>
                    </div>
                </div>
            `,
            post_event_feedback: `
                <div style="${baseStyle}">
                    <div style="${cardStyle}">
                        <div style="${headerStyle}">
                            <h2>💬 How Was It?</h2>
                        </div>
                        <div style="${contentStyle}">
                            <p>Hello <strong>${data.userName}</strong>,</p>
                            <p>We hope you enjoyed <strong>${data.eventTitle}</strong>!</p>
                            <p>We'd love to hear your feedback to help us improve future events.</p>
                            <a href="${data.eventLink}" style="${buttonStyle}">Share Feedback</a>
                        </div>
                    </div>
                </div>
            `
        };

        return templates[type] || `<p>Notification for ${data.eventTitle}</p>`;
    }
};
