// Debug: Log email configuration at startup
console.log('=== Email Plugin Configuration ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET (default: 587)');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'NOT SET');
console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME || 'NOT SET');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '****SET****' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@qbixacademia.com (default)');
console.log('EMAIL_REPLY_TO:', process.env.EMAIL_REPLY_TO || 'support@qbixacademia.com (default)');
console.log('==================================');

export default () => ({
    i18n: {
        enabled: true,
    },

    'users-permissions': {
        config: {
            register: {
                allowedFields: [
                    'username',
                    'email',
                    'password',
                    'fullName',
                    'phone',
                    'bio',
                ],
            },
        },
    },

    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
                secure: process.env.SMTP_SECURE,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
                // ... any custom nodemailer options
            },
            settings: {
                defaultFrom: process.env.EMAIL_FROM || 'noreply@qbixacademia.com',
                defaultReplyTo: process.env.EMAIL_REPLY_TO || 'support@qbixacademia.com',
            },
        },
    },
});
