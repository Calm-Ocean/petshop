"use client";

import { useEffect } from 'react';
import { Assignment, mockAssignments } from '@/data/mockAssignments';
import { useAuth } from '@/context/AuthContext';
import { mockCourses } from '@/data/mockCourses';
import { toast } from 'sonner';
import { differenceInDays, parseISO } from 'date-fns';

interface AssignmentWithPriority extends Assignment {
  priority: 'High' | 'Medium' | 'Low';
  daysLeft: number;
}

const getAssignmentPriority = (assignment: Assignment): AssignmentWithPriority => {
  const dueDate = parseISO(assignment.dueDate);
  const today = new Date();
  const daysLeft = differenceInDays(dueDate, today);

  let priority: 'High' | 'Medium' | 'Low' = 'Low';
  if (daysLeft <= 3 && daysLeft >= 0) {
    priority = 'High';
  } else if (daysLeft > 3 && daysLeft <= 7) {
    priority = 'Medium';
  }

  return { ...assignment, priority, daysLeft };
};

export const useAssignmentNotifications = () => {
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user) return;

    let relevantAssignments: Assignment[] = [];

    if (role === 'student') {
      const enrolledCourseIds = mockCourses
        .filter(course => course.studentIds.includes(user.id))
        .map(course => course.id);
      relevantAssignments = mockAssignments.filter(assignment =>
        enrolledCourseIds.includes(assignment.courseId)
      );
    } else if (role === 'teacher') {
      relevantAssignments = mockAssignments.filter(assignment =>
        assignment.teacherName === user.name
      );
    }

    const assignmentsWithPriority = relevantAssignments
      .map(getAssignmentPriority)
      .filter(a => a.daysLeft >= 0) // Only show upcoming or due today
      .sort((a, b) => a.daysLeft - b.daysLeft); // Sort by closest due date

    // Show notifications for high priority assignments
    assignmentsWithPriority.forEach(assignment => {
      if (assignment.priority === 'High') {
        const message = assignment.daysLeft === 0
          ? `Assignment "${assignment.title}" for ${assignment.courseId} is DUE TODAY!`
          : `Assignment "${assignment.title}" for ${assignment.courseId} is due in ${assignment.daysLeft} day(s)!`;
        toast.warning(message, {
          duration: 10000, // Keep high priority toasts longer
          id: `assignment-${assignment.id}`, // Use ID to prevent duplicate toasts for the same assignment
        });
      }
    });

  }, [user, role]);
};