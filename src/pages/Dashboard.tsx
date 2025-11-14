"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/MainLayout';
import AdminDashboardSummary from '@/components/dashboard/AdminDashboardSummary';
import TeacherDashboardSummary from '@/components/dashboard/TeacherDashboardSummary';
import StudentDashboardSummary from '@/components/dashboard/StudentDashboardSummary';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Or a loading spinner while redirecting
  }

  const renderDashboardSummary = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboardSummary />;
      case 'teacher':
        return <TeacherDashboardSummary />;
      case 'student':
        return <StudentDashboardSummary />;
      default:
        return (
          <p className="text-center text-muted-foreground">
            Select an option from the navigation to get started.
          </p>
        );
    }
  };

  return (
    <MainLayout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          Welcome, {user.name}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          You are logged in as a {role}.
        </p>
      </div>

      {renderDashboardSummary()}
    </MainLayout>
  );
};

export default Dashboard;