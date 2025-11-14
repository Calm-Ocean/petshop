"use client";

import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ManageCourses = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Courses</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            This is where the list of courses will be displayed.
            Admins can add, edit, or delete courses here.
          </p>
          {/* Course listing table/components will go here */}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ManageCourses;