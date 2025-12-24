'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_staff: boolean;
  role: {
    id: string;
    name: string;
    level: number;
  };
  tier: {
    id: string;
    name: string;
  } | null;
}

interface Role {
  id: string;
  name: string;
  level: number;
}

interface Tier {
  id: string;
  name: string;
}

export default function UserManagement() {
  const router = useRouter();
  const { isAdmin, loading: permLoading } = usePermissions();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      const [usersRes, rolesRes, tiersRes] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            is_staff,
            role:member_roles!inner(id, name, level),
            tier:member_tiers(id, name)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('member_roles').select('id, name, level').order('level', { ascending: false }),
        supabase.from('member_tiers').select('id, name').order('priority', { ascending: true }),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (tiersRes.error) throw tiersRes.error;

      setUsers(usersRes.data as any);
      setRoles(rolesRes.data);
      setTiers(tiersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, roleId: string) {
    try {
      const selectedRole = roles.find((r) => r.id === roleId);
      const isStaffRole = ['Admin', 'Content Manager', 'Activity Manager', 'Event Manager'].includes(
        selectedRole?.name || ''
      );

      const { error } = await supabase
        .from('profiles')
        .update({
          role_id: roleId,
          is_staff: isStaffRole,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  }

  async function updateUserTier(userId: string, tierId: string | null) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tier_id: tierId })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User tier updated successfully',
      });

      loadData();
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user tier',
        variant: 'destructive',
      });
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role.id}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.tier?.id || 'none'}
                          onValueChange={(value) =>
                            updateUserTier(user.id, value === 'none' ? null : value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {tiers.map((tier) => (
                              <SelectItem key={tier.id} value={tier.id}>
                                {tier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.is_staff ? (
                          <Badge variant="default">Staff</Badge>
                        ) : (
                          <Badge variant="secondary">Member</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}