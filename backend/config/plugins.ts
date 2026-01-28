const isProd = process.env.NODE_ENV === 'production';

// Log email config on startup (production only)
if (isProd) {
    console.log('[EMAIL CONFIG] Loading email plugin configuration...');
    console.log('[EMAIL CONFIG] SMTP_HOST:', process.env.SMTP_HOST);
    console.log('[EMAIL CONFIG] SMTP_PORT:', process.env.SMTP_PORT);
    console.log('[EMAIL CONFIG] SMTP_USERNAME:', process.env.SMTP_USERNAME ? '***SET***' : 'NOT SET');
    console.log('[EMAIL CONFIG] SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***SET***' : 'NOT SET');
    console.log('[EMAIL CONFIG] EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('[EMAIL CONFIG] TLS Mode:', Number(process.env.SMTP_PORT) === 465 ? 'SSL' : 'STARTTLS');
}

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
                // port: Number(process.env.SMTP_PORT) || 587,
                port: 465,
                secure: true,  // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
                // Production improvements for Gmail
                requireTLS: false,
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
