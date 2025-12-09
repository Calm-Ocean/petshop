"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // With Supabase Auth UI, the LoginPage handles both login and registration.
    // We can simply redirect to the login page and inform the user.
    toast.info("Please use the Login page to register for a new account.");
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <p className="text-muted-foreground">Redirecting to login page for registration...</p>
    </div>
  );
};

export default RegisterPage;