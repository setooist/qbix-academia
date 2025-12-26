
export default {
  register() { },
  async bootstrap({ strapi }: { strapi: any }) {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (settings.email_confirmation) {
      console.log('Force disabling email confirmation...');
      await pluginStore.set({
        key: 'advanced',
        value: { ...settings, email_confirmation: false },
      });
      console.log('Email confirmation has been disabled via bootstrap.');
    }
  },
};
