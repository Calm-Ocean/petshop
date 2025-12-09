"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Assignment } from '@/data/mockAssignments'; // Import Assignment type
import { showSuccess } from '@/utils/toast';

interface DeleteAssignmentDialogProps {
  assignment: Assignment; // Changed from 'course' to 'assignment'
  onDeleteAssignment: (assignmentId: string) => void;
}

const DeleteAssignmentDialog = ({ assignment, onDeleteAssignment }: DeleteAssignmentDialogProps) => {
  const handleDelete = () => {
    onDeleteAssignment(assignment.id);
    showSuccess(`Assignment "${assignment.title}" deleted successfully!`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the assignment{' '}
            <span className="font-semibold">"{assignment.title}"</span> for course{' '}
            <span className="font-semibold">"{assignment.courseId}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAssignmentDialog;