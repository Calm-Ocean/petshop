"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define a type for the user data fetched from the Edge Function
interface AdminUserDetail {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
}

// Function to call the admin-get-user-details Edge Function
const getUserDetailsAdmin = async (userId: string): Promise<AdminUserDetail> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User not authenticated.');
  }

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
    throw new Error(errorData.error || 'Failed to fetch user details');
  }

  return response.json();
};

// Function to call the admin-update-user-profile Edge Function
const updateUserProfileAdmin = async ({ userId, updatedData }: { userId: string; updatedData: Partial<AdminUserDetail> }): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User not authenticated.');
  }

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
    throw new Error(errorData.error || 'Failed to update user profile');
  }
};

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();

  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['adminUserDetail', userId],
    queryFn: () => getUserDetailsAdmin(userId!),
    enabled: !!userId,
  });

  const [currentUser, setCurrentUser] = useState<AdminUserDetail | null>(null);

  useEffect(() => {
    if (userDetails) {
      setCurrentUser(userDetails);
    }
  }, [userDetails]);

  const updateUserMutation = useMutation({
    mutationFn: updateUserProfileAdmin,
    onSuccess: () => {
      toast.success('User profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Invalidate list of users
      queryClient.invalidateQueries({ queryKey: ['adminUserDetail', userId] }); // Invalidate specific user detail
      navigate('/admin/users');
    },
    onError: (err: any) => {
      toast.error(`Failed to update user: ${err.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleRoleChange = (value: 'admin' | 'user') => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userId) return;

    if (!currentUser.first_name || !currentUser.last_name || !currentUser.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    updateUserMutation.mutate({
      userId,
      updatedData: {
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        role: currentUser.role,
      },
    });
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

  if (!currentUser) {
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
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <UserIcon className="h-7 w-7" /> Edit User: {currentUser.email}
          </CardTitle>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={currentUser.email} disabled />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" type="text" required value={currentUser.first_name || ''} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" type="text" required value={currentUser.last_name || ''} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={currentUser.role} onValueChange={handleRoleChange}>
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
              {updateUserMutation.isPending ? 'Updating User...' : 'Update User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserPage;