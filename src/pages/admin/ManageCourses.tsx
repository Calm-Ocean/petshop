"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseTable from '@/components/CourseTable';
import AddCourseDialog from '@/components/AddCourseDialog'; // Import the new dialog component
import { mockCourses, Course } from '@/data/mockCourses'; // Import mock data and Course interface

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const handleAddCourse = (newCourseData: Omit<Course, 'id' | 'studentsEnrolled'>) => {
    const newCourse: Course = {
      id: `c${courses.length + 1}`, // Simple ID generation for mock data
      studentsEnrolled: 0, // New courses start with 0 students
      ...newCourseData,
    };
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Courses</h1>
        <AddCourseDialog onAddCourse={handleAddCourse} /> {/* Integrate the dialog */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTable courses={courses} />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ManageCourses;