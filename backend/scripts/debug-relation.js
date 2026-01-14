const strapi = require('@strapi/strapi');

async function debugRelationId() {
    const app = await strapi.createStrapi({ distDir: './dist' }).load();

    try {
        // 1. Get a valid user (Assignee)
        const [user] = await app.entityService.findMany('plugin::users-permissions.user', { limit: 1 });
        if (!user) throw new Error("No users found.");

        // 2. Get a valid template
        const [template] = await app.entityService.findMany('api::activity-template.activity-template', { limit: 1 });
        if (!template) throw new Error("No template found.");
        try {
            const assignment = await app.entityService.create('api::activity-assignment.activity-assignment', {
                data: {
                    activity_template: template.id, // Using Number ID
                    assignee: user.id,              // Using Number ID
                    status: 'not_started',
                    due_date: new Date(Date.now() + 86400000).toISOString(),
                    start_date: new Date().toISOString(),
                }
            });
        } catch (e) {
            console.error("FAILED using Integers:", e.message);
        }

    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
}

debugRelationId();
