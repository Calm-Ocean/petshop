"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Grade } from '@/data/mockGrades';
import { Assignment } from '@/data/mockAssignments';
import { User } from '@/context/AuthContext';
import { showSuccess } from '@/utils/toast';

// Define the form schema using Zod
const formSchema = z.object({
  score: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().nullable().refine((val) => val === null || (val >= 0 && val <= 100), {
      message: 'Score must be between 0 and 100, or empty.',
    })
  ),
  feedback: z.string().nullable(),
  status: z.enum(['graded', 'submitted', 'not_submitted'], {
    required_error: 'Please select a status.',
  }),
});

interface GradeAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade | null; // Existing grade, or null if creating a new one
  student: User;
  assignment: Assignment;
  onSaveGrade: (updatedGrade: Grade) => void;
}

const GradeAssignmentDialog = ({
  open,
  onOpenChange,
  grade,
  student,
  assignment,
  onSaveGrade,
}: GradeAssignmentDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: grade?.score || null,
      feedback: grade?.feedback || '',
      status: grade?.status || 'not_submitted',
    },
  });

  useEffect(() => {
    if (grade) {
      form.reset({
        score: grade.score,
        feedback: grade.feedback,
        status: grade.status,
      });
    } else {
      form.reset({
        score: null,
        feedback: '',
        status: 'not_submitted',
      });
    }
  }, [grade, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedGrade: Grade = {
      id: grade?.id || `g${Date.now()}`, // Generate a new ID if it's a new grade
      studentId: student.id,
      assignmentId: assignment.id,
      courseId: assignment.courseId,
      score: values.score,
      feedback: values.feedback,
      status: values.status,
    };
    onSaveGrade(updatedGrade);
    showSuccess('Grade saved successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Grade Assignment</DialogTitle>
          <DialogDescription>
            Set the score and provide feedback for {student.name}'s submission for "{assignment.title}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score (0-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 85"
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide constructive feedback..."
                      className="resize-none"
                      {...field}
                      value={field.value === null ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not_submitted">Not Submitted</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Grade</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeAssignmentDialog;