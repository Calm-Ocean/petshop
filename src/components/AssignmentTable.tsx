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
import { differenceInDays, parseISO } from 'date-fns';

interface AssignmentTableProps {
  assignments: Assignment[];
  onEditClick: (assignment: Assignment) => void;
  onDeleteClick: (assignment: Assignment) => void;
}

// Helper function to determine priority
const getAssignmentPriorityDetails = (assignment: Assignment) => {
  const dueDate = parseISO(assignment.dueDate);
  const today = new Date();
  const daysLeft = differenceInDays(dueDate, today);

  let priority: 'High' | 'Medium' | 'Low' | 'Completed' = 'Low';
  let priorityBadgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';

  if (assignment.status === 'graded' || assignment.status === 'submitted') {
    priority = 'Completed';
    priorityBadgeVariant = 'outline';
  } else if (daysLeft < 0) {
    priority = 'High'; // Overdue
    priorityBadgeVariant = 'destructive';
  } else if (daysLeft <= 3) {
    priority = 'High'; // Due soon
    priorityBadgeVariant = 'destructive';
  } else if (daysLeft <= 7) {
    priority = 'Medium'; // Upcoming
    priorityBadgeVariant = 'default';
  }

  return { priority, daysLeft, priorityBadgeVariant };
};

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
            <TableHead className="text-center">Priority</TableHead> {/* New column */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => {
            const { priority, daysLeft, priorityBadgeVariant } = getAssignmentPriorityDetails(assignment);
            return (
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
                <TableCell className="text-center">
                  <Badge variant={priorityBadgeVariant}>
                    {priority} {priority !== 'Completed' && daysLeft >= 0 ? `(${daysLeft} days)` : ''}
                    {priority !== 'Completed' && daysLeft < 0 ? `(Overdue by ${Math.abs(daysLeft)} days)` : ''}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentTable;