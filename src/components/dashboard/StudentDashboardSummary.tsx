"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, ClipboardList, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockCourses, Course } from '@/data/mockCourses';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockGrades, Grade } from '@/data/mockGrades';

const StudentDashboardSummary = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (user && user.role === 'student') {
      const coursesStudentEnrolledIn = mockCourses.filter(course =>
        course.studentIds.includes(user.id)
      );
      setEnrolledCourses(coursesStudentEnrolledIn);

      const enrolledCourseIds = coursesStudentEnrolledIn.map(c => c.id);

      const assignmentsForStudent = mockAssignments.filter(assignment =>
        enrolledCourseIds.includes(assignment.courseId)
      );

      const gradesForStudent = mockGrades.filter(grade => grade.studentId === user.id);

      // Filter for upcoming assignments (not submitted or graded yet)
      const now = new Date();
      const upcoming = assignmentsForStudent.filter(assignment => {
        const assignmentGrade = gradesForStudent.find(g => g.assignmentId === assignment.id);
        const isNotCompleted = !assignmentGrade || (assignmentGrade.status !== 'submitted' && assignmentGrade.status !== 'graded');
        const isFutureDate = new Date(assignment.dueDate) >= now;
        return isNotCompleted && isFutureDate;
      });
      setUpcomingAssignments(upcoming);

      // Get recent grades (last 3 graded assignments)
      const gradedAssignments = gradesForStudent
        .filter(grade => grade.status === 'graded' && grade.score !== null)
        .sort((a, b) => b.id.localeCompare(a.id)) // Simple sort for "recent"
        .slice(0, 3);
      setRecentGrades(gradedAssignments);
    }
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          <BookOpenText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrolledCourses.length}</div>
          <p className="text-xs text-muted-foreground">
            Courses you are currently taking
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
          <p className="text-xs text-muted-foreground">
            Assignments due soon
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Grades</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {recentGrades.length > 0 ? recentGrades[0].score : '-'}
          </div>
          <p className="text-xs text-muted-foreground">
            {recentGrades.length > 0 ? `Latest: ${mockAssignments.find(a => a.id === recentGrades[0].assignmentId)?.title}` : 'No recent grades'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboardSummary;