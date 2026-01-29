export default ({ env }) => {
    // ============================================
    // CRITICAL: Add logging INSIDE the function to check Runtime Env
    // ============================================
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 PLUGIN CONFIG LOADING - RUNTIME CHECK');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    console.log('📂 Current Working Directory:', process.cwd());
    console.log('');

    const smtpHost = env('SMTP_HOST');
    const smtpPort = env('SMTP_PORT');
    const smtpUsername = env('SMTP_USERNAME');
    const smtpPassword = env('SMTP_PASSWORD');
    const emailFrom = env('EMAIL_FROM');
    const emailReplyTo = env('EMAIL_REPLY_TO');

    console.log('--- EMAIL ENVIRONMENT VARIABLES (via env()) ---');
    console.log('SMTP_HOST:', smtpHost || '❌ UNDEFINED');
    console.log('SMTP_PORT:', smtpPort || '❌ UNDEFINED');
    console.log('SMTP_USERNAME:', smtpUsername || '❌ UNDEFINED');
    console.log('SMTP_PASSWORD:', smtpPassword ? '✅ SET (length: ' + smtpPassword.length + ')' : '❌ NOT SET');
    console.log('EMAIL_FROM:', emailFrom || '❌ UNDEFINED');
    console.log('EMAIL_REPLY_TO:', emailReplyTo || '❌ UNDEFINED');
    console.log('');

    const emailConfig = {
        provider: 'nodemailer',
        providerOptions: {
            host: smtpHost,
            port: env.int('SMTP_PORT', 587),
            secure: env.bool('SMTP_SECURE', false),
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
            tls: {
                rejectUnauthorized: false,
            },
            requireTLS: false,
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 30000,
        },
        settings: {
            defaultFrom: emailFrom,
            defaultReplyTo: emailReplyTo || emailFrom,
        },
    };

    // Log the final email configuration
    console.log('🔧 FINAL EMAIL CONFIG OBJECT:');
    console.log(JSON.stringify({
        provider: emailConfig.provider,
        providerOptions: {
            host: emailConfig.providerOptions.host,
            port: emailConfig.providerOptions.port,
            secure: emailConfig.providerOptions.secure,
            auth: {
                user: emailConfig.providerOptions.auth.user,
                pass: emailConfig.providerOptions.auth.pass ? '***HIDDEN***' : undefined
            }
        },
        settings: emailConfig.settings
    }, null, 2));
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    return {
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
            config: emailConfig,
        },
    };
};