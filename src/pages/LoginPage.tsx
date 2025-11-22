"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext'; // Import useSession
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSession(); // Use user and isLoading from SessionContext

  useEffect(() => {
    if (!isLoading && user) {
      // If user is already logged in, redirect to home
      navigate('/home');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login / Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]} // You can add 'google', 'github', etc. here if configured in Supabase
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
            theme="light" // Or "dark" based on your app's theme
            redirectTo={window.location.origin + '/home'} // Redirect to home after successful auth
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;