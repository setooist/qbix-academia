'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

export default function RoleManagement() {
  const router = useRouter();
  const { isAdmin, loading: permLoading } = usePermissions();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permLoading && !isAdmin()) {
      router.push('/');
    }
  }, [isAdmin, permLoading, router]);

  useEffect(() => {
    if (isAdmin()) {
      loadData();
    }
  }, [isAdmin]);

  async function loadData() {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
        supabase.from('member_roles').select('*').order('level', { ascending: false }),
        supabase.from('permissions').select('*').order('resource', { ascending: true }),
        supabase.from('role_permissions').select('role_id, permission_id'),
      ]);

      if (rolesRes.error) throw rolesRes.error;
      if (permissionsRes.error) throw permissionsRes.error;
      if (rolePermissionsRes.error) throw rolePermissionsRes.error;

      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
      setRolePermissions(rolePermissionsRes.data);

      if (rolesRes.data.length > 0 && !selectedRole) {
        setSelectedRole(rolesRes.data[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roles and permissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function hasPermission(roleId: string, permissionId: string): boolean {
    return rolePermissions.some(
      (rp) => rp.role_id === roleId && rp.permission_id === permissionId
    );
  }

  async function togglePermission(roleId: string, permissionId: string) {
    const hasIt = hasPermission(roleId, permissionId);

    try {
      if (hasIt) {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permissionId);

        if (error) throw error;

        setRolePermissions((prev) =>
          prev.filter((rp) => !(rp.role_id === roleId && rp.permission_id === permissionId))
        );
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role_id: roleId, permission_id: permissionId });

        if (error) throw error;

        setRolePermissions((prev) => [...prev, { role_id: roleId, permission_id: permissionId }]);
      }

      toast({
        title: 'Success',
        description: 'Permission updated successfully',
      });
    } catch (error) {
      console.error('Error toggling permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update permission',
        variant: 'destructive',
      });
    }
  }

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  const permissionsByResource = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (permLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">Configure roles and their permissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedRole === role.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs opacity-80">Level {role.level}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {selectedRoleData?.name} Permissions
              </CardTitle>
              <CardDescription>
                {selectedRoleData?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRole && (
                <div className="space-y-6">
                  {Object.entries(permissionsByResource).map(([resource, perms]) => (
                    <div key={resource} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-4 capitalize">{resource}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {perms.map((permission) => {
                          const checked = hasPermission(selectedRole, permission.id);
                          return (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                            >
                              <Checkbox
                                id={permission.id}
                                checked={checked}
                                onCheckedChange={() =>
                                  togglePermission(selectedRole, permission.id)
                                }
                                className="mt-1"
                              />
                              <label
                                htmlFor={permission.id}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium">{permission.display_name}</div>
                                <div className="text-sm text-gray-600">
                                  {permission.description}
                                </div>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {permission.name}
                                </Badge>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}