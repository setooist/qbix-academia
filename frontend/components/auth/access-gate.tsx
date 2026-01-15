import React from 'react';

export interface AccessGateProps {
    user: any;
    allowedTiers?: string[] | null;
    allowedRoles?: { type?: string; name?: string }[] | null;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// Helper to check tier access
export const checkTierAccess = (allowedTiers: string[] | null | undefined, user: any) => {
    if (!allowedTiers?.length) return false;

    if (allowedTiers.includes('FREE')) return true;
    if (!user) return false;

    // Mentor check
    const userRoleName = user.role?.name?.toLowerCase();
    const userRoleType = user.role?.type?.toLowerCase();
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    if (allowedTiers.includes(user.tier || 'FREE')) return true;

    if (allowedTiers.includes('SUBSCRIPTION')) {
        if (user.subscriptionActive === true) return true;

        // Safe access to subscriptions
        const subscriptions = user.subscriptions;
        if (Array.isArray(subscriptions)) {
            const activeSubscription = subscriptions.some((sub: any) => sub.subscription_status === 'active');
            if (activeSubscription) return true;
        }
    }

    return false;
};

// Helper to check role access
export const checkRoleAccess = (allowedRoles: { type?: string; name?: string }[] | null | undefined, user: any) => {
    if (!allowedRoles) return false;
    if (allowedRoles.length === 0) return true;

    const isPubliclyAllowed = allowedRoles.some(
        (r: any) => r.type === 'public' || r.name?.toLowerCase() === 'public'
    );
    if (isPubliclyAllowed) return true;

    if (!user) return false;

    const userRoleType = user.role?.type?.toLowerCase();
    const userRoleName = user.role?.name?.toLowerCase();

    // Also allow Mentors via role check fallback
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    return allowedRoles.some((r: any) =>
        (r.type && r.type.toLowerCase() === userRoleType) ||
        (r.name && r.name.toLowerCase() === userRoleName)
    );
};

export const checkAccess = (user: any, allowedTiers?: string[] | null, allowedRoles?: { type?: string; name?: string }[] | null) => {
    // Check Tiers (Primary Check)
    if (allowedTiers && allowedTiers.length > 0) {
        return checkTierAccess(allowedTiers, user);
    }
    // Fallback to Roles check
    return checkRoleAccess(allowedRoles || [], user);
};

export const AccessGate: React.FC<AccessGateProps> = ({
    user,
    allowedTiers,
    allowedRoles,
    children,
    fallback = null
}) => {
    const hasAccess = checkAccess(user, allowedTiers, allowedRoles);

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
