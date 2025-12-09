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
import { useSession } from '@/context/SessionContext'; // Import useSession to get the current user's session

// Define the User type based on your Supabase profiles table
interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: UserRole;
}

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useSession(); // Get the current session

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      if (!session) {
        throw new Error("User session not found. Please log in as an admin.");
      }

      const response = await fetch('https://ftzflhuktluskcyqrwny.supabase.co/functions/v1/admin-list-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users from Edge Function');
      }

      return response.json();
    },
    enabled: !!session, // Only run query if session exists
  });

  const handleDelete = async (userId: string, username: string) => {
    if (!session) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"? This will also delete their Supabase authentication record.`)) {
      try {
        const response = await fetch('https://ftzflhuktluskcyqrwny.supabase.co/functions/v1/admin-delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user via Edge Function');
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