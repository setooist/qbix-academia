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
                secure: false,  // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
                // Production improvements for Gmail
                requireTLS: true,
                connectionTimeout: 10000,  // 10 seconds
                greetingTimeout: 10000,
                socketTimeout: 30000,
            },
            settings: {
                defaultFrom: process.env.EMAIL_FROM,
                defaultReplyTo: process.env.EMAIL_REPLY_TO,
            },
        },
    },
});
