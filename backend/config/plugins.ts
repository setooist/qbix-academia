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
