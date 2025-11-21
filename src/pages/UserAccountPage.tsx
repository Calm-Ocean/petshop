"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, History } from 'lucide-react';

const UserAccountPage = () => {
  const { user } = useAuth();

  if (!user) {
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
              <p className="text-muted-foreground">Username:</p>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Full Name:</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role:</p>
              <p className="text-lg font-medium capitalize">{user.role}</p>
            </div>
            {/* Add more user details here if available, e.g., email, address */}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/my-orders" className="w-full sm:w-auto">
              <Button className="w-full">
                <History className="h-4 w-4 mr-2" /> View Order History
              </Button>
            </Link>
            {/* Potentially add an "Edit Profile" button here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountPage;