import server from './server';
import userLifecycles from './content-types/user/lifecycles';

export default (plugin) => {
    // Load standard server extension
    plugin = server(plugin);

    // Explicitly set the lifecycles for User content type
    // This ensures our hooks run even if Strapi's auto-loader misses the extension folder
    if (plugin.contentTypes.user) {
        plugin.contentTypes.user.lifecycles = userLifecycles;
    }

    return plugin;
};
