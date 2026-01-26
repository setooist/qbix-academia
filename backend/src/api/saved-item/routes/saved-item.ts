/**
 * saved-item router
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/saved-items/toggle',
            handler: 'saved-item.toggle',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/saved-items/check',
            handler: 'saved-item.checkSaved',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/saved-items/my-library',
            handler: 'saved-item.mySavedItems',
            config: {
                policies: [],
                middlewares: []
            }
        }
    ]
};
