"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import AssignmentCalendarView from '@/components/AssignmentCalendarView';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const TeacherCalendar = () => {
  const { user } = useAuth();
  const [teacherAssignments, setTeacherAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      const filteredAssignments = mockAssignments.filter(assignment =>
        assignment.teacherName === user.name
      );
      setTeacherAssignments(filteredAssignments);
    } else {
      setTeacherAssignments([]);
      showError("You must be logged in as a teacher to view this page.");
    }
  }, [user]);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">My Assignment Calendar</h1>
      <AssignmentCalendarView
        assignments={teacherAssignments}
        title="Assignments You Created"
        emptyMessage="No assignments found for your courses."
      />
    </MainLayout>
  );
};

export default TeacherCalendar;