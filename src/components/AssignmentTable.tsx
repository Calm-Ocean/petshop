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
import { SquarePen, Trash2 } from 'lucide-react';
import { Assignment } from '@/data/mockAssignments';

interface AssignmentTableProps {
  assignments: Assignment[];
  onEditClick: (assignment: Assignment) => void;
  onDeleteClick: (assignment: Assignment) => void;
}

const AssignmentTable = ({ assignments, onEditClick, onDeleteClick }: AssignmentTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.title}</TableCell>
              <TableCell>{assignment.courseId}</TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    assignment.status === 'pending'
                      ? 'secondary'
                      : assignment.status === 'graded'
                      ? 'default'
                      : 'outline'
                  }
                >
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEditClick(assignment)}>
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDeleteClick(assignment)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentTable;