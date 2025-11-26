"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Login = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users to their dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">LMS Portal</CardTitle>
          <CardDescription>Sign in or sign up to access the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]} // No third-party providers for now
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="light" // Use light theme, can be made dynamic later
            redirectTo={window.location.origin + '/dashboard'} // Redirect after successful auth
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;