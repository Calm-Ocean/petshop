"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Grade } from '@/data/mockGrades';
import { mockAssignments } from '@/data/mockAssignments';
import { mockCourses } from '@/data/mockCourses';

interface GradeTableProps {
  grades: Grade[];
}

const GradeTable = ({ grades }: GradeTableProps) => {
  const getAssignmentTitle = (assignmentId: string) => {
    const assignment = mockAssignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : 'N/A';
  };

  const getCourseCode = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.code : 'N/A';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="font-medium">{getCourseCode(grade.courseId)}</TableCell>
              <TableCell>{getAssignmentTitle(grade.assignmentId)}</TableCell>
              <TableCell className="text-center">
                {grade.score !== null ? grade.score : '-'}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    grade.status === 'graded'
                      ? 'default'
                      : grade.status === 'submitted'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {grade.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>{grade.feedback || 'No feedback yet.'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GradeTable;