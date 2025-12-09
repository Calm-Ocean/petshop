"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import AssignmentCalendarView from '@/components/AssignmentCalendarView';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockCourses } from '@/data/mockCourses';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const StudentCalendar = () => {
  const { user } = useAuth();
  const [studentAssignments, setStudentAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (user && user.role === 'student') {
      const enrolledCourseIds = mockCourses
        .filter(course => course.studentIds.includes(user.id))
        .map(course => course.id);

      const filteredAssignments = mockAssignments.filter(assignment =>
        enrolledCourseIds.includes(assignment.courseId)
      );
      setStudentAssignments(filteredAssignments);
    } else {
      setStudentAssignments([]);
      showError("You must be logged in as a student to view this page.");
    }
  }, [user]);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">My Assignment Calendar</h1>
      <AssignmentCalendarView
        assignments={studentAssignments}
        title="Upcoming Assignments"
        emptyMessage="No upcoming assignments found."
      />
    </MainLayout>
  );
};

export default StudentCalendar;