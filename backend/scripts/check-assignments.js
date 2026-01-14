const strapi = require('@strapi/strapi');

async function checkAssignments() {
    // Initialize Strapi
    const app = await strapi.createStrapi({ distDir: './dist' }).load();

    try {
        // Fetch all activity assignments using Entity Service
        const assignments = await app.entityService.findMany('api::activity-assignment.activity-assignment', {
            populate: ['activity_template', 'assignee', 'mentor']
        });


        if (assignments.length > 0) {
            // Check assignees
            const assignees = assignments.map(a => a.assignee?.username || 'No Assignee');
        }
    } catch (error) {
        console.error("Error checking assignments:", error);
    } finally {
        // app.destroy(); // Don't destroy if we want to keep it running, but usually safe for script
        process.exit(0);
    }
}

checkAssignments();
