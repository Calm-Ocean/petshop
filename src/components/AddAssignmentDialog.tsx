"use client";

import React, { useState } from 'react';
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
  DialogTrigger,
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
import { PlusCircle } from 'lucide-react';
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
  }).nonempty("Title cannot be empty."),
  courseId: z.string().min(1, {
    message: 'Please select a course.',
  }).nonempty("Course must be selected."),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Due date must be in YYYY-MM-DD format.',
  }).nonempty("Due date cannot be empty."),
  status: z.enum(['pending', 'graded', 'submitted'], {
    required_error: 'Please select an assignment status.',
  }),
  files: z.string().optional(), // New field for files (comma-separated)
});

interface AddAssignmentDialogProps {
  onAddAssignment: (newAssignment: Omit<Assignment, 'id' | 'teacherName'>) => void;
}

const AddAssignmentDialog = ({ onAddAssignment }: AddAssignmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      courseId: '',
      dueDate: '',
      status: 'pending', // Default status
      files: '', // Default empty string for files
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || user.role !== 'teacher') {
      return;
    }
    const newAssignmentData = {
      ...values,
      files: values.files ? values.files.split(',').map(file => file.trim()).filter(file => file !== '') : [],
    };
    onAddAssignment(newAssignmentData);
    showSuccess('Assignment added successfully!');
    form.reset(); // Reset form fields
    setOpen(false); // Close the dialog
  };

  // Filter courses to only show those taught by the current teacher
  const teacherCourses = mockCourses.filter(course => course.teacher === user?.name);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogDescription>
            Fill in the details for the new assignment. Click save when you're done.
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
                    <Input placeholder="e.g., React Component Design" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="submit">Save Assignment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentDialog;