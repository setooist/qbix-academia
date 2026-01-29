// config/plugins.js (or config/plugins.ts if using TypeScript)

// ============================================
// CRITICAL: Add logging BEFORE any other code
// ============================================
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('🔍 PLUGIN CONFIG LOADING - FULL ENVIRONMENT CHECK');
console.log('═══════════════════════════════════════════════════════');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('📂 Current Working Directory:', process.cwd());
console.log('');
console.log('--- EMAIL ENVIRONMENT VARIABLES ---');
console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ UNDEFINED');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ UNDEFINED');
console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME || '❌ UNDEFINED');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ SET (length: ' + process.env.SMTP_PASSWORD.length + ')' : '❌ NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ UNDEFINED');
console.log('EMAIL_REPLY_TO:', process.env.EMAIL_REPLY_TO || '❌ UNDEFINED');
console.log('');
console.log('--- ALL ENVIRONMENT VARIABLES (first 100 chars each) ---');
Object.keys(process.env)
    .filter(key => key.includes('SMTP') || key.includes('EMAIL') || key.includes('MAIL'))
    .forEach(key => {
        const value = process.env[key];
        console.log(`${key}:`, value ? value.substring(0, 100) : '❌ UNDEFINED');
    });
console.log('');
console.log('--- SAMPLE OF OTHER ENV VARS (to verify env is loading) ---');
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT || 'not set');
console.log('HOST:', process.env.HOST || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('APP_KEYS exists:', process.env.APP_KEYS ? 'YES' : 'NO');
console.log('═══════════════════════════════════════════════════════');
console.log('');

const isProd = process.env.NODE_ENV === 'production';

// Email configuration object
const emailConfig = {
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
        requireTLS: false,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 30000,
    },
    settings: {
        defaultFrom: process.env.EMAIL_FROM,
        defaultReplyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
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
console.log('');

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
        config: emailConfig,
    },
});