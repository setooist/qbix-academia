const strapi = require('@strapi/strapi');

async function createTestAssignment() {
    const app = await strapi.createStrapi({ distDir: './dist' }).load();

    try {
        // 1. Get a valid user (Assignee)
        const [user] = await app.entityService.findMany('plugin::users-permissions.user', { limit: 1 });
        if (!user) throw new Error("No users found to assign to.");
        // 2. Get a valid template
        const [template] = await app.entityService.findMany('api::activity-template.activity-template', { limit: 1 });
        if (!template) throw new Error("No activity template found.");
        // 3. Create Assignment
        const assignment = await app.entityService.create('api::activity-assignment.activity-assignment', {
            data: {
                activity_template: template.documentId,
                assignee: user.documentId,
                status: 'not_started',
                due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                start_date: new Date().toISOString(),
            }
        });
    } catch (error) {
s        console.error(error);
    } finally {
        process.exit(0);
    }
}

createTestAssignment();
