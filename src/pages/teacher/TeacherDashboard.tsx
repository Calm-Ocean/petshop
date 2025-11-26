"use client";

import React from 'react';
import MainLayout from '@/components/MainLayout';

const TeacherDashboard = () => {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Teacher Dashboard</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Welcome, Teacher! Here you can manage your courses, assignments, and student grades.
      </p>
      {/* Teacher-specific content will go here */}
    </MainLayout>
  );
};

export default TeacherDashboard;