"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SquarePen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/context/AuthContext';

// Define the User type based on your Supabase profiles table
interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string; // Assuming email is available from auth.users and can be joined or inferred
  role: UserRole;
}

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role');

      if (profilesError) {
        throw profilesError;
      }

      // Fetch emails from auth.users for a more complete user list
      const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers();

      if (authUsersError) {
        throw authUsersError;
      }

      const usersWithEmails: User[] = profiles.map(profile => {
        const authUser = authUsers.users.find(au => au.id === profile.id);
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: authUser?.email || 'N/A', // Fallback if email not found
          role: profile.role as UserRole,
        };
      });
      return usersWithEmails;
    },
  });

  const handleDelete = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This will also delete their Supabase authentication record.`)) {
      try {
        // Delete from public.profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) {
          throw profileError;
        }

        // Delete from auth.users (this will also trigger RLS cascade delete if set up)
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
          throw authError;
        }

        toast.success(`User ${username} deleted successfully!`);
        queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Invalidate cache to refetch users
      } catch (error: any) {
        console.error('Error deleting user:', error);
        toast.error(`Failed to delete user ${username}: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Manage Users</CardTitle>
          {/* Registration is handled via the login page, so no direct 'add user' button here */}
        </CardHeader>
        <CardContent>
          {users && users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end space-x-2">
                        <Link to={`/admin/users/edit/${user.id}`}>
                          <Button variant="ghost" size="icon">
                            <SquarePen className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user.id, user.email)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsersPage;