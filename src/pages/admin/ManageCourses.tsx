"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseTable from '@/components/CourseTable';
import AddCourseDialog from '@/components/AddCourseDialog';
import EditCourseDialog from '@/components/EditCourseDialog';
import ManageEnrollmentDialog from '@/components/ManageEnrollmentDialog'; // New import
import { mockCourses, Course } from '@/data/mockCourses';

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false); // New state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleAddCourse = (newCourseData: Omit<Course, 'id' | 'studentsEnrolled' | 'studentIds'>) => {
    const newCourse: Course = {
      id: `c${courses.length + 1}`, // Simple ID generation for mock data
      studentsEnrolled: 0, // New courses start with 0 students
      studentIds: [], // New courses start with no enrolled students
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

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
  };

  // New handlers for enrollment management
  const handleEnrollmentClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrollmentDialogOpen(true);
  };

  const handleSaveEnrollment = (courseId: string, newStudentIds: string[]) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, studentIds: newStudentIds, studentsEnrolled: newStudentIds.length }
          : course
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
          <CourseTable
            courses={courses}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteCourse}
            onEnrollClick={handleEnrollmentClick} // Pass new handler
          />
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

      {selectedCourse && (
        <ManageEnrollmentDialog // New dialog
          open={isEnrollmentDialogOpen}
          onOpenChange={setIsEnrollmentDialogOpen}
          course={selectedCourse}
          onSaveEnrollment={handleSaveEnrollment}
        />
      )}
    </MainLayout>
  );
};

export default ManageCourses;