"use client";

import React, { useState } from 'react';
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
import { SquarePen } from 'lucide-react';
import { Assignment } from '@/data/mockAssignments';
import { Grade } from '@/data/mockGrades';
import { User } from '@/context/AuthContext';
import GradeAssignmentDialog from './GradeAssignmentDialog';

interface AssignmentGradesTableProps {
  assignment: Assignment;
  students: User[]; // All students enrolled in the course for this assignment
  grades: Grade[]; // All grades for this assignment
  onSaveGrade: (updatedGrade: Grade) => void;
}

const AssignmentGradesTable = ({
  assignment,
  students,
  grades,
  onSaveGrade,
}: AssignmentGradesTableProps) => {
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const handleGradeClick = (student: User) => {
    const studentGrade = grades.find(
      (g) => g.studentId === student.id && g.assignmentId === assignment.id
    );
    setSelectedStudent(student);
    setSelectedGrade(studentGrade || null); // Pass existing grade or null for new
    setIsGradeDialogOpen(true);
  };

  const getGradeStatusBadge = (status: Grade['status']) => {
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
            <TableHead>Student Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const studentGrade = grades.find(
              (g) => g.studentId === student.id && g.assignmentId === assignment.id
            );
            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-center">
                  {getGradeStatusBadge(studentGrade?.status || 'not_submitted')}
                </TableCell>
                <TableCell className="text-center">
                  {studentGrade?.score !== null ? studentGrade?.score : '-'}
                </TableCell>
                <TableCell>{studentGrade?.feedback || 'No feedback yet.'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleGradeClick(student)}>
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedStudent && (
        <GradeAssignmentDialog
          open={isGradeDialogOpen}
          onOpenChange={setIsGradeDialogOpen}
          grade={selectedGrade}
          student={selectedStudent}
          assignment={assignment}
          onSaveGrade={onSaveGrade}
        />
      )}
    </div>
  );
};

export default AssignmentGradesTable;