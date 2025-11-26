"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseTable from '@/components/CourseTable';
import { mockCourses, Course } from '@/data/mockCourses';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const TeacherCourses = () => {
  const { user } = useAuth();
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      // Filter courses where the teacher's name matches the logged-in user's name
      const filteredCourses = mockCourses.filter(course => course.teacher === user.name);
      setTeacherCourses(filteredCourses);
    } else {
      setTeacherCourses([]);
      showError("You must be logged in as a teacher to view this page.");
    }
  }, [user]);

  // For a teacher, they might not be able to edit/delete courses directly from this view.
  // These are placeholder functions for now.
  const handleEditClick = (course: Course) => {
    showError(`Editing course "${course.title}" is not yet implemented for teachers.`);
  };

  const handleDeleteClick = (course: Course) => {
    showError(`Deleting course "${course.title}" is not yet implemented for teachers.`);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses You Teach</CardTitle>
        </CardHeader>
        <CardContent>
          {teacherCourses.length > 0 ? (
            <CourseTable
              courses={teacherCourses}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <p className="text-center text-muted-foreground">No courses assigned to you.</p>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TeacherCourses;