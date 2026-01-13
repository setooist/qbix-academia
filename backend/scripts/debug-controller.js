const strapi = require('@strapi/strapi');

async function debugController() {
    const app = await strapi.createStrapi({ distDir: './dist' }).load();

    try {
        const controller = app.controller('api::activity-assignment.activity-assignment');

        // Check if 'find' is a function
        if (typeof controller.find !== 'function') {
            throw new Error("Controller 'find' is not a function!");
        }

        // Mock Context for Find
        const ctxFind = {
            query: {},
            state: { user: undefined },
            body: null
        };
        const ctxAuth = {
            query: {},
            state: {
                user: { id: 1, documentId: 'mockdocid', role: { type: 'authenticated' } }
            },
            body: null
        };

    } catch (error) {
        console.error("Error debugging controller:", error);
    } finally {
        process.exit(0);
    }
}

debugController();
