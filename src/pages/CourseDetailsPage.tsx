"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { mockCourses, Course } from '@/data/mockCourses';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockUsers, User } from '@/data/mockUsers';
import { showError } from '@/utils/toast';
import AssignmentTable from '@/components/AssignmentTable'; // Reusing existing table
import UserTable from '@/components/UserTable'; // Reusing existing table
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseAssignments, setCourseAssignments] = useState<Assignment[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);

  useEffect(() => {
    if (!user) {
      showError('You need to log in to view course details.');
      navigate('/');
      return;
    }

    const foundCourse = mockCourses.find(c => c.id === courseId);
    if (!foundCourse) {
      showError('Course not found.');
      navigate('/dashboard'); // Or a more appropriate fallback
      return;
    }
    setCourse(foundCourse);

    // Filter assignments for this course
    const assignments = mockAssignments.filter(a => a.courseId === foundCourse.id);
    setCourseAssignments(assignments);

    // Filter enrolled students for this course
    const students = mockUsers.filter(u => foundCourse.studentIds.includes(u.id) && u.role === 'student');
    setEnrolledStudents(students);

  }, [courseId, user, navigate]);

  if (!course) {
    return (
      <MainLayout>
        <div className="text-center text-muted-foreground">Loading course details...</div>
      </MainLayout>
    );
  }

  // Placeholder functions for tables (actual edit/delete might be role-specific)
  const handleAssignmentEdit = (assignment: Assignment) => {
    showError(`Editing assignment "${assignment.title}" is not available from this view.`);
  };
  const handleAssignmentDelete = (assignment: Assignment) => {
    showError(`Deleting assignment "${assignment.title}" is not available from this view.`);
  };
  const handleUserEdit = (student: User) => {
    showError(`Editing student "${student.name}" is not available from this view.`);
  };
  const handleUserDelete = (student: User) => {
    showError(`Deleting student "${student.name}" is not available from this view.`);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {course.title} ({course.code})
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Taught by: <span className="font-semibold">{course.teacher}</span>
        </p>
        <Badge
          variant={
            course.status === 'active'
              ? 'default'
              : course.status === 'draft'
              ? 'secondary'
              : 'outline'
          }
          className="mb-4"
        >
          Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </Badge>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              {course.description}
            </CardDescription>
            <p className="mt-4 text-sm text-muted-foreground">
              Currently enrolled: {course.studentsEnrolled} students
            </p>
          </CardContent>
        </Card>
      </div>

      {(role === 'admin' || role === 'teacher') && (
        <>
          <Separator className="my-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Assignments</h2>
          {courseAssignments.length > 0 ? (
            <AssignmentTable
              assignments={courseAssignments}
              onEditClick={handleAssignmentEdit}
              onDeleteClick={handleAssignmentDelete}
            />
          ) : (
            <p className="text-center text-muted-foreground">No assignments for this course yet.</p>
          )}
        </>
      )}

      {(role === 'admin' || role === 'teacher') && (
        <>
          <Separator className="my-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Enrolled Students</h2>
          {enrolledStudents.length > 0 ? (
            <UserTable
              users={enrolledStudents}
              onEditClick={handleUserEdit}
              onDeleteClick={handleUserDelete}
            />
          ) : (
            <p className="text-center text-muted-foreground">No students enrolled in this course yet.</p>
          )}
        </>
      )}

      {role === 'student' && courseAssignments.length > 0 && (
        <>
          <Separator className="my-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Assignments</h2>
          {/* Reusing StudentAssignmentTable, but need to pass studentGrades and onMarkAsSubmitted */}
          {/* For simplicity, I'll just list them here without submission functionality */}
          <AssignmentTable
            assignments={courseAssignments}
            onEditClick={handleAssignmentEdit} // Placeholder
            onDeleteClick={handleAssignmentDelete} // Placeholder
          />
          <p className="text-sm text-muted-foreground mt-4">
            To manage your submissions, please visit the "My Assignments" page.
          </p>
        </>
      )}
    </MainLayout>
  );
};

export default CourseDetailsPage;