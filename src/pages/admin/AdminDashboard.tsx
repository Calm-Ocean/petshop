"use client";

import React from 'react';
import MainLayout from '@/components/MainLayout';

const AdminDashboard = () => {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Welcome, Admin! Here you can manage users, courses, and system settings.
      </p>
      {/* Admin-specific content will go here */}
    </MainLayout>
  );
};

export default AdminDashboard;