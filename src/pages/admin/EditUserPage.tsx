"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/context/SessionContext'; // Import useSession

// Define the User type based on your Supabase profiles table
interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: UserRole;
}

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const { session } = useSession(); // Get the current session

  const { data: userProfile, isLoading, error, refetch } = useQuery<UserProfileData>({
    queryKey: ['adminUser', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is missing.");
      if (!session) throw new Error("User session not found. Please log in as an admin.");

      const response = await fetch('https://ftzflhuktluskcyqrwny.supabase.co/functions/v1/admin-get-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user details from Edge Function');
      }

      return response.json();
    },
    enabled: !!userId && !!session, // Only run query if userId and session are available
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfileData>) => {
      if (!userId) throw new Error("User ID is missing for update.");
      if (!session) throw new Error("User session not found. Please log in as an admin.");

      const response = await fetch('https://ftzflhuktluskcyqrwny.supabase.co/functions/v1/admin-update-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, updatedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user via Edge Function');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(`User updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Invalidate list of users
      refetch(); // Refetch the current user's details
    },
    onError: (err: any) => {
      toast.error(`Failed to update user: ${err.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (userProfile) {
      updateUserMutation.mutate({ [id]: value });
    }
  };

  const handleRoleChange = (value: UserRole) => {
    if (userProfile) {
      updateUserMutation.mutate({ role: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The mutation is already triggered by individual input changes.
    // This submit button can just navigate back or confirm.
    navigate('/admin/users');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading user: {error.message}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Edit User: {userProfile.first_name} {userProfile.last_name}</CardTitle>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userProfile.email || ''} disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" type="text" value={userProfile.first_name || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" type="text" value={userProfile.last_name || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={userProfile.role || ''} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserPage;