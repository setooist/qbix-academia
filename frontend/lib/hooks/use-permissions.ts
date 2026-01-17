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
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setPermissions([]);
      setRole(null);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    // Get role from Strapi user object
    // Strapi stores role in user.role.name or user.role.type
    const userRole = user.role?.name || user.role?.type || null;
    setRole(userRole);

    // Check if user is staff/admin based on Strapi role
    const adminRoles = ['admin', 'super_admin', 'superadmin', 'authenticated'];
    const roleLower = userRole?.toLowerCase() || '';
    const isAdminRole = adminRoles.includes(roleLower) ||
      roleLower.includes('admin') ||
      user.role?.type === 'admin';
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

  const isAdmin = useCallback((): boolean => {
    // Check multiple admin/manager role patterns for Strapi
    if (!role) return false;
    const roleLower = role.toLowerCase();
    // Allow Admin, Mentor, and event manager roles
    return roleLower === 'admin' ||
      roleLower === 'super_admin' ||
      roleLower === 'superadmin' ||
      roleLower === 'mentor' ||
      roleLower === 'event_manager' ||
      roleLower.includes('admin') ||
      roleLower.includes('mentor');
  }, [role]);

  return {
    permissions,
    role,
    isStaff,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
  };
}