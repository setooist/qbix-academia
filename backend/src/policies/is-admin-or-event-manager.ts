/**
 * Policy: is-admin-or-event-manager
 * Restricts access to Admin and Event Manager roles only
 */
const isAdminOrEventManager = async (policyContext: any, config: any, { strapi }: any) => {
    const user = policyContext.state?.user;

    if (!user) {
        return false;
    }

    const roleType = user.role?.type?.toLowerCase() || '';
    const roleName = user.role?.name?.toLowerCase() || '';

    const allowedRoles = [
        'admin',
        'super_admin',
        'superadmin',
        'event_manager',
        'eventmanager'
    ];

    // Check if user has an allowed role
    const hasAllowedRole = allowedRoles.some(
        (allowed) => roleType === allowed || roleName === allowed
    );

    if (!hasAllowedRole) {
        strapi.log.warn(`[Policy] User ${user.id} denied access - role: ${roleName || roleType}`);
        return false;
    }

    return true;
};

export default isAdminOrEventManager;
