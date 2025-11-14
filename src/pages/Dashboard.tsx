"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad'; // Keep this for now

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to login if not authenticated
    } else {
      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard'); // We'll create this route later
          break;
        case 'teacher':
          navigate('/teacher/dashboard'); // We'll create this route later
          break;
        case 'student':
          navigate('/student/dashboard'); // We'll create this route later
          break;
        default:
          navigate('/'); // Fallback to login
          break;
      }
    }
  }, [user, role, navigate]);

  // This component will primarily handle redirects, so a simple loading message is fine.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Dashboard...</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Redirecting you to your portal.</p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;