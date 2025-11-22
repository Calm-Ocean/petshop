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
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define the User type based on your Supabase profiles table
interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
}

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ['adminUser', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is missing.");
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }
      return data as UserProfileData;
    },
    enabled: !!userId, // Only run query if userId is available
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfileData>) => {
      if (!userId) throw new Error("User ID is missing for update.");
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(`User updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Invalidate list of users
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId] }); // Invalidate specific user
      navigate('/admin/users');
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
    if (!userProfile) {
      toast.error("User data not loaded.");
      return;
    }

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