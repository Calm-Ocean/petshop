"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradeTable from '@/components/GradeTable';
import { mockGrades, Grade } from '@/data/mockGrades';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const StudentGrades = () => {
  const { user } = useAuth();
  const [studentGrades, setStudentGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (user && user.role === 'student') {
      // Filter grades to only show those for the logged-in student
      const filteredGrades = mockGrades.filter(grade => grade.studentId === user.id);
      setStudentGrades(filteredGrades);
    } else {
      setStudentGrades([]);
      showError("You must be logged in as a student to view this page.");
    }
  }, [user]);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Grades</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignment Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {studentGrades.length > 0 ? (
            <GradeTable grades={studentGrades} />
          ) : (
            <p className="text-center text-muted-foreground">No grades available yet.</p>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default StudentGrades;