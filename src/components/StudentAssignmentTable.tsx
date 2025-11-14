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
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Assignment } from '@/data/mockAssignments';
import { Grade } from '@/data/mockGrades';
import { mockCourses } from '@/data/mockCourses';

interface StudentAssignmentTableProps {
  assignments: Assignment[];
  studentGrades: Grade[];
  onMarkAsSubmitted: (assignmentId: string) => void;
}

const StudentAssignmentTable = ({
  assignments,
  studentGrades,
  onMarkAsSubmitted,
}: StudentAssignmentTableProps) => {
  const getCourseCode = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.code : 'N/A';
  };

  const getAssignmentStatus = (assignmentId: string): Grade['status'] => {
    const grade = studentGrades.find(g => g.assignmentId === assignmentId);
    return grade?.status || 'not_submitted';
  };

  const getStatusBadge = (status: Grade['status']) => {
    switch (status) {
      case 'graded':
        return <Badge variant="default">Graded</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'not_submitted':
      default:
        return <Badge variant="outline">Not Submitted</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Assignment Title</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => {
            const status = getAssignmentStatus(assignment.id);
            const isSubmittedOrGraded = status === 'submitted' || status === 'graded';

            return (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{getCourseCode(assignment.courseId)}</TableCell>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell className="text-center">{getStatusBadge(status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsSubmitted(assignment.id)}
                    disabled={isSubmittedOrGraded}
                    className={isSubmittedOrGraded ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {status === 'graded' ? 'Graded' : status === 'submitted' ? 'Submitted' : 'Submit'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentAssignmentTable;