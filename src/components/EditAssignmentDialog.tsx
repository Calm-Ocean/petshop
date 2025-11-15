"use client";

import React, { useEffect, useState } from 'react';
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
import { Assignment } from '@/data/mockAssignments';
import { showSuccess } from '@/utils/toast';
import { useAuth } from '@/context/AuthContext';
import { mockCourses } from '@/data/mockCourses';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea for files

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  courseId: z.string().min(1, {
    message: 'Please select a course.',
  }),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Due date must be in YYYY-MM-DD format.',
  }),
  status: z.enum(['pending', 'graded', 'submitted'], {
    required_error: 'Please select an assignment status.',
  }),
  files: z.string().optional(), // New field for files (comma-separated)
});

interface EditAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment;
  onEditAssignment: (updatedAssignment: Assignment) => void;
}

const EditAssignmentDialog = ({ open, onOpenChange, assignment, onEditAssignment }: EditAssignmentDialogProps) => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: assignment.title,
      courseId: assignment.courseId,
      dueDate: assignment.dueDate,
      status: assignment.status,
      files: assignment.files.join(', '), // Join array to string for input
    },
  });

  // Reset form values when the assignment prop changes
  useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment.title,
        courseId: assignment.courseId,
        dueDate: assignment.dueDate,
        status: assignment.status,
        files: assignment.files.join(', '),
      });
    }
  }, [assignment, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || user.role !== 'teacher') {
      return;
    }
    const updatedAssignment: Assignment = {
      ...assignment,
      ...values,
      teacherName: user.name, // Ensure teacherName is consistent
      files: values.files ? values.files.split(',').map(file => file.trim()).filter(file => file !== '') : [],
    };
    onEditAssignment(updatedAssignment);
    showSuccess('Assignment updated successfully!');
    onOpenChange(false); // Close the dialog
  };

  // Filter courses to only show those taught by the current teacher
  const teacherCourses = mockCourses.filter(course => course.teacher === user?.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Make changes to the assignment details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teacherCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Files (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., instructions.pdf, starter_code.zip"
                      className="resize-none"
                      {...field}
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
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentDialog;