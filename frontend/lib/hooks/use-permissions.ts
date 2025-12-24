import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setRole(null);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    loadUserPermissions();
  }, [user]);

  async function loadUserPermissions() {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          is_staff,
          role_id,
          member_roles!inner(
            name,
            level
          )
        `)
        .eq('id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        setIsStaff(profile.is_staff || false);
        setRole((profile.member_roles as any)?.name || null);

        const { data: rolePermissions, error: permError } = await supabase
          .from('role_permissions')
          .select(`
            permissions!inner(name)
          `)
          .eq('role_id', profile.role_id);

        if (permError) throw permError;

        const permissionNames = rolePermissions.map(
          (rp: any) => rp.permissions.name
        );
        setPermissions(permissionNames);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  }

  function hasPermission(permission: string): boolean {
    return permissions.includes(permission);
  }

  function hasAnyPermission(perms: string[]): boolean {
    return perms.some((p) => permissions.includes(p));
  }

  function hasAllPermissions(perms: string[]): boolean {
    return perms.every((p) => permissions.includes(p));
  }

  function isAdmin(): boolean {
    return role === 'Admin';
  }

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