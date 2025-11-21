"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, name, role')
        .eq('id', userId)
        .single();

      if (error) {
        toast.error("User not found: " + error.message);
        console.error("Error fetching user profile:", error);
        navigate('/admin/users');
      } else {
        setUserProfile(data);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleRoleChange = (value: UserRole) => {
    setUserProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!userProfile) return;

    if (!userProfile.username || !userProfile.name || !userProfile.role) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: userProfile.username,
        name: userProfile.name,
        role: userProfile.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userProfile.id);

    setSubmitting(false);

    if (error) {
      toast.error(`Failed to update user ${userProfile.username}: ` + error.message);
      console.error("Error updating user profile:", error);
    } else {
      toast.success(`User ${userProfile.username} updated successfully!`);
      navigate('/admin/users');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!userProfile) {
    return null; // Should be handled by navigation in useEffect
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Edit User: {userProfile.username || userProfile.id}</CardTitle>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" required value={userProfile.username || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" required value={userProfile.name || ''} onChange={handleInputChange} />
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
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Updating User...' : 'Update User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserPage;