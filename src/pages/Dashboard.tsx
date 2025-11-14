"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/MainLayout';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to login if not authenticated
    }
    // No longer redirecting based on role here, Navbar will handle navigation
  }, [user, navigate]);

  if (!user) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <MainLayout>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Welcome, {user.name}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          You are logged in as a {role}. Use the navigation above to access your portal.
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;