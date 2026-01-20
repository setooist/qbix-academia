import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
}

export function usePermissions() {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setPermissions([]);
      setRole(null);
      setAllRoles([]);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    // Get primary role from Strapi user object
    const roles: string[] = [];

    // Primary role (manyToOne)
    if (user.role) {
      const roleName = user.role.name || user.role.type;
      if (roleName) {
        roles.push(roleName.toLowerCase());
      }
    }

    // Additional roles (oneToMany)
    if (user.additionalRoles && Array.isArray(user.additionalRoles)) {
      user.additionalRoles.forEach((r: any) => {
        const roleName = r?.name || r?.type;
        if (roleName) {
          roles.push(roleName.toLowerCase());
        }
      });
    }

    // Set primary role for display purposes
    const primaryRole = roles[0] || null;
    setRole(primaryRole);
    setAllRoles(roles);

    // Check if user is staff/admin based on any of their roles
    const adminRoles = ['admin', 'super_admin', 'superadmin', 'authenticated'];
    const isAdminRole = roles.some(r =>
      adminRoles.includes(r) || r.includes('admin')
    );
    setIsStaff(isAdminRole);

    // Set basic permissions based on role
    if (isAdminRole) {
      setPermissions([
        'events.read',
        'events.write',
        'events.delete',
        'users.read',
        'users.write',
        'content.read',
        'content.write'
      ]);
    } else {
      setPermissions(['events.read', 'content.read']);
    }

    setLoading(false);
  }, [user, authLoading]);

  const hasPermission = useCallback((permission: string): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasAnyPermission = useCallback((perms: string[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  }, [permissions]);

  const hasAllPermissions = useCallback((perms: string[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  }, [permissions]);

  // Helper to check if user has any of the specified roles
  const hasRole = useCallback((roleNames: string[]): boolean => {
    return allRoles.some(r =>
      roleNames.some(rn => r === rn || r.replace('_', ' ') === rn)
    );
  }, [allRoles]);

  const isEventManager = useCallback((): boolean => {
    if (allRoles.length === 0) return false;
    return hasRole(['admin', 'super_admin', 'superadmin', 'event_manager', 'event manager']) ||
      allRoles.some(r => r.includes('admin'));
  }, [allRoles, hasRole]);

  const isAdmin = useCallback((): boolean => {
    if (allRoles.length === 0) return false;
    return hasRole(['admin', 'super_admin', 'superadmin', 'mentor', 'event_manager']) ||
      allRoles.some(r => r.includes('admin') || r.includes('mentor'));
  }, [allRoles, hasRole]);

  const isActivityManager = useCallback((): boolean => {
    if (allRoles.length === 0) return false;
    // Allow pure admins to access activity manager stuff too
    if (allRoles.some(r => r.includes('admin'))) return true;
    return hasRole(['activity_manager', 'activity manager']);
  }, [allRoles, hasRole]);

  const isStudent = useCallback((): boolean => {
    // A student is explicitly someone who is NOT any of the staff roles
    if (allRoles.length === 0) return true; // Default no role = student perspective

    const staffRoles = [
      'admin', 'super_admin', 'superadmin', 'mentor',
      'event_manager', 'event manager',
      'activity_manager', 'activity manager'
    ];

    const isStaffRole = allRoles.some(r =>
      staffRoles.includes(r) || r.includes('admin')
    );

    return !isStaffRole;
  }, [allRoles]);

  return {
    permissions,
    role,
    allRoles,
    isStaff,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isEventManager,
    isActivityManager,
    isStudent,
  };
}