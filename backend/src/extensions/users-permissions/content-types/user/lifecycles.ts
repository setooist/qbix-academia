export default {
    async beforeCreate(event) {
        console.log('###### User beforeCreate lifecycle triggered ######');
        const { data } = event.params;

        console.log('User data received:', JSON.stringify({ ...data, password: '***' }, null, 2));

        if (!data.role) {
            console.log('No role found in user data.');
            return;
        }

        let roleName = '';

        try {
            // Role can be an ID (number/string) or a connect object
            if (typeof data.role === 'number' || typeof data.role === 'string') {
                const role = await strapi.db.query('plugin::users-permissions.role').findOne({
                    where: { id: data.role },
                });
                roleName = role?.name?.toLowerCase();
            } else if (data.role.connect && data.role.connect.length > 0) {
                const roleId = data.role.connect[0].id;
                const role = await strapi.db.query('plugin::users-permissions.role').findOne({
                    where: { id: roleId },
                });
                roleName = role?.name?.toLowerCase();
            }
        } catch (e) {
            console.error('Error fetching role in beforeCreate:', e);
        }

        console.log('Detected Role Name:', roleName);

        // Check for 'student' (case-insensitive check is safer)
        if (roleName === 'student') {
            console.log('Role is Student. Setting resetPasswordOnNextLogin flag and sending email...');

            // 1. Force password reset
            data.resetPasswordOnNextLogin = true;

            // 2. Send email with credentials
            if (data.email && data.password) {
                try {
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                    const loginLink = `${frontendUrl}/auth/login`;

                    // Using strapi.plugins['email'] is the standard way to access the service
                    await strapi.plugin('email').service('email').send({
                        to: data.email,
                        from: 'no-reply@agrisavant.com',
                        subject: 'Welcome to AgriSavant - Your Student Account',
                        html: `
                            <p>Hello ${data.fullName || data.username},</p>
                            <p>Your student account has been created.</p>
                            <p><strong>Username:</strong> ${data.username}</p>
                            <p><strong>Password:</strong> ${data.password}</p>
                            <p>Please login here: <a href="${loginLink}">${loginLink}</a></p>
                            <p>You will be asked to change your password upon first login.</p>
                        `,
                    });
                    console.log(`Invite email successfully sent to ${data.email}`);
                } catch (err) {
                    console.error('Failed to send info email to student:', err);
                }
            } else {
                console.log('Skipping email: Missing email or password in data.');
            }
        } else {
            console.log(`Role '${roleName}' is not 'student'. Skipping invite logic.`);
        }
    }
};
