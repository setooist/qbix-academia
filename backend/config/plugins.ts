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
                port: Number(process.env.SMTP_PORT) || 587,
                secure: Number(process.env.SMTP_PORT) === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
                requireTLS: Number(process.env.SMTP_PORT) === 587, // Required for STARTTLS on port 587
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: process.env.NODE_ENV === 'production', // Enforce in production
                    minVersion: 'TLSv1.2',
                },
            },
            settings: {
                defaultFrom: process.env.EMAIL_FROM,
                defaultReplyTo: process.env.EMAIL_REPLY_TO,
            },
        },
    },
});
