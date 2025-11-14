"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseTable from '@/components/CourseTable';
import AddCourseDialog from '@/components/AddCourseDialog';
import EditCourseDialog from '@/components/EditCourseDialog'; // Import the new dialog component
import { mockCourses, Course } from '@/data/mockCourses';

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleAddCourse = (newCourseData: Omit<Course, 'id' | 'studentsEnrolled'>) => {
    const newCourse: Course = {
      id: `c${courses.length + 1}`, // Simple ID generation for mock data
      studentsEnrolled: 0, // New courses start with 0 students
      ...newCourseData,
    };
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Courses</h1>
        <AddCourseDialog onAddCourse={handleAddCourse} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTable courses={courses} onEditClick={handleEditClick} /> {/* Pass onEditClick */}
        </CardContent>
      </Card>

      {selectedCourse && (
        <EditCourseDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          course={selectedCourse}
          onEditCourse={handleEditCourse}
        />
      )}
    </MainLayout>
  );
};

export default ManageCourses;