"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentAssignmentTable from '@/components/StudentAssignmentTable';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockCourses } from '@/data/mockCourses';
import { mockGrades, Grade } from '@/data/mockGrades';
import { useAuth } from '@/context/AuthContext';
import { showError, showSuccess } from '@/utils/toast';

const StudentAssignments = () => {
  const { user } = useAuth();
  const [studentAssignments, setStudentAssignments] = useState<Assignment[]>([]);
  const [currentStudentGrades, setCurrentStudentGrades] = useState<Grade[]>(mockGrades);

  useEffect(() => {
    if (user && user.role === 'student') {
      // Get courses the student is enrolled in
      const enrolledCourseIds = mockCourses
        .filter(course => course.studentIds.includes(user.id))
        .map(course => course.id);

      // Filter assignments for those courses
      const filteredAssignments = mockAssignments.filter(assignment =>
        enrolledCourseIds.includes(assignment.courseId)
      );
      setStudentAssignments(filteredAssignments);

      // Filter grades relevant to this student
      const gradesForThisStudent = mockGrades.filter(grade => grade.studentId === user.id);
      setCurrentStudentGrades(gradesForThisStudent);
    } else {
      setStudentAssignments([]);
      setCurrentStudentGrades([]);
      showError("You must be logged in as a student to view this page.");
    }
  }, [user]);

  const handleMarkAsSubmitted = (assignmentId: string, fileName?: string) => {
    if (!user) {
      showError("You must be logged in to submit assignments.");
      return;
    }

    setCurrentStudentGrades((prevGrades) => {
      const existingGradeIndex = prevGrades.findIndex(
        (g) => g.studentId === user.id && g.assignmentId === assignmentId
      );

      if (existingGradeIndex > -1) {
        // Update existing grade status to 'submitted' if it's 'not_submitted'
        const updatedGrades = [...prevGrades];
        if (updatedGrades[existingGradeIndex].status === 'not_submitted') {
          updatedGrades[existingGradeIndex] = {
            ...updatedGrades[existingGradeIndex],
            status: 'submitted',
            submittedFileName: fileName || null, // Store the submitted file name
          };
          showSuccess(`Assignment marked as submitted! ${fileName ? `File: ${fileName}` : ''}`);
        } else {
          showError('Assignment is already submitted or graded.');
        }
        return updatedGrades;
      } else {
        // Create a new grade entry for this submission
        const newGrade: Grade = {
          id: `g${Date.now()}-${user.id}-${assignmentId}`,
          studentId: user.id,
          assignmentId: assignmentId,
          courseId: mockAssignments.find(a => a.id === assignmentId)?.courseId || 'unknown',
          score: null,
          feedback: null,
          status: 'submitted',
          submittedFileName: fileName || null, // Store the submitted file name
        };
        showSuccess(`Assignment marked as submitted! ${fileName ? `File: ${fileName}` : ''}`);
        return [...prevGrades, newGrade];
      }
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Assignments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {studentAssignments.length > 0 ? (
            <StudentAssignmentTable
              assignments={studentAssignments}
              studentGrades={currentStudentGrades}
              onMarkAsSubmitted={handleMarkAsSubmitted}
            />
          ) : (
            <p className="text-center text-muted-foreground">No assignments found for your enrolled courses.</p>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default StudentAssignments;