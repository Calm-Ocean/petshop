"use client";

import React, { useRef, useState } from 'react';
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
import { CheckCircle2, Upload } from 'lucide-react';
import { Assignment } from '@/data/mockAssignments';
import { Grade } from '@/data/mockGrades';
import { mockCourses } from '@/data/mockCourses';

interface StudentAssignmentTableProps {
  assignments: Assignment[];
  studentGrades: Grade[];
  onMarkAsSubmitted: (assignmentId: string, fileName?: string) => void;
}

const StudentAssignmentTable = ({
  assignments,
  studentGrades,
  onMarkAsSubmitted,
}: StudentAssignmentTableProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAssignmentIdForUpload, setCurrentAssignmentIdForUpload] = useState<string | null>(null);

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

  const handleFileButtonClick = (assignmentId: string) => {
    setCurrentAssignmentIdForUpload(assignmentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && currentAssignmentIdForUpload) {
      const file = event.target.files[0];
      onMarkAsSubmitted(currentAssignmentIdForUpload, file.name);
      // Reset the file input value to allow re-uploading the same file
      event.target.value = '';
      setCurrentAssignmentIdForUpload(null);
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt,.zip" // Example accepted file types
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileButtonClick(assignment.id)}
                    disabled={isSubmittedOrGraded}
                    className={isSubmittedOrGraded ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {status === 'graded' ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Graded
                      </>
                    ) : status === 'submitted' ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Submitted
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Upload File
                      </>
                    )}
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