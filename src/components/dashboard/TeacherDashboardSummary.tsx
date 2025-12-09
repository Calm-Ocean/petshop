"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, ClipboardList, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockCourses, Course } from '@/data/mockCourses';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockGrades, Grade } from '@/data/mockGrades';

const TeacherDashboardSummary = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myAssignments, setMyAssignments] = useState<Assignment[]>([]);
  const [pendingGrades, setPendingGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      const coursesTaught = mockCourses.filter(course => course.teacher === user.name);
      setMyCourses(coursesTaught);

      const assignmentsCreated = mockAssignments.filter(assignment => assignment.teacherName === user.name);
      setMyAssignments(assignmentsCreated);

      // Find grades for assignments taught by this teacher that are 'submitted' but not 'graded'
      const assignmentsIdsTaught = assignmentsCreated.map(a => a.id);
      const gradesToReview = mockGrades.filter(grade =>
        assignmentsIdsTaught.includes(grade.assignmentId) && grade.status === 'submitted'
      );
      setPendingGrades(gradesToReview);
    }
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Courses Taught</CardTitle>
          <BookOpenText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{myCourses.length}</div>
          <p className="text-xs text-muted-foreground">
            Active and draft courses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{myAssignments.length}</div>
          <p className="text-xs text-muted-foreground">
            Across all your courses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingGrades.length}</div>
          <p className="text-xs text-muted-foreground">
            Assignments awaiting your review
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboardSummary;