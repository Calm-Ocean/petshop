"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { MadeWithDyad } from '@/components/made-with-dyad';

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Teacher Dashboard</h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400">
          Welcome, Teacher! Here you can manage your courses, assignments, and student grades.
        </p>
        {/* Teacher-specific content will go here */}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default TeacherDashboard;