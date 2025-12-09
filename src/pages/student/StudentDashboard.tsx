"use client";

import React from 'react';
import MainLayout from '@/components/MainLayout';

const StudentDashboard = () => {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Student Dashboard</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Welcome, Student! Here you can view your courses, assignments, and grades.
      </p>
      {/* Student-specific content will go here */}
    </MainLayout>
  );
};

export default StudentDashboard;