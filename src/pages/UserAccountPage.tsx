"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, History } from 'lucide-react';

const UserAccountPage = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Loading account details...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Please log in to view your account details.
        </p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <UserIcon className="h-7 w-7" /> My Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Email:</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Username:</p>
              <p className="text-lg font-medium">{profile.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Full Name:</p>
              <p className="text-lg font-medium">{profile.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role:</p>
              <p className="text-lg font-medium capitalize">{profile.role}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/my-orders" className="w-full sm:w-auto">
              <Button className="w-full">
                <History className="h-4 w-4 mr-2" /> View Order History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountPage;