const strapi = require('@strapi/strapi');

async function checkData() {
    const app = await strapi.createStrapi({ distDir: './dist' }).load();

    try {
        // Check Users
        const users = await app.entityService.findMany('plugin::users-permissions.user');
        // Check Activity Templates
        const templates = await app.entityService.findMany('api::activity-template.activity-template');
        // Check Activity Assignments
        const assignments = await app.entityService.findMany('api::activity-assignment.activity-assignment');

    } catch (error) {
        console.error("Error checking data:", error);
    } finally {
        process.exit(0);
    }
}

checkData();
