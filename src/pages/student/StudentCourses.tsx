"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseTable from '@/components/CourseTable';
import { mockCourses, Course } from '@/data/mockCourses';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const StudentCourses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (user && user.role === 'student') {
      // Filter courses where the student's ID is in the course's studentIds array
      const filteredCourses = mockCourses.filter(course => course.studentIds.includes(user.id));
      setEnrolledCourses(filteredCourses);
    } else {
      setEnrolledCourses([]);
      showError("You must be logged in as a student to view this page.");
    }
  }, [user]);

  // Students typically cannot edit or delete courses.
  // These are placeholder functions for now.
  const handleEditClick = (course: Course) => {
    showError(`You do not have permission to edit course "${course.title}".`);
  };

  const handleDeleteClick = (course: Course) => {
    showError(`You do not have permission to delete course "${course.title}".`);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses You Are Enrolled In</CardTitle>
        </CardHeader>
        <CardContent>
          {enrolledCourses.length > 0 ? (
            <CourseTable
              courses={enrolledCourses}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <p className="text-center text-muted-foreground">You are not enrolled in any courses.</p>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default StudentCourses;