"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Course } from '@/data/mockCourses';
import { User } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockUsers';
import { showSuccess } from '@/utils/toast';

interface ManageEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSaveEnrollment: (courseId: string, newStudentIds: string[]) => void;
}

const ManageEnrollmentDialog = ({
  open,
  onOpenChange,
  course,
  onSaveEnrollment,
}: ManageEnrollmentDialogProps) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(course.studentIds);

  // Filter out only student users from mockUsers
  const allStudents = mockUsers.filter(user => user.role === 'student');

  useEffect(() => {
    if (course) {
      setSelectedStudentIds(course.studentIds);
    }
  }, [course]);

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setSelectedStudentIds((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const handleSave = () => {
    onSaveEnrollment(course.id, selectedStudentIds);
    showSuccess(`Enrollment for "${course.title}" updated successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Enrollment for "{course.title}"</DialogTitle>
          <DialogDescription>
            Select students to enroll in this course.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="grid gap-4">
            {allStudents.length > 0 ? (
              allStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudentIds.includes(student.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(student.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`student-${student.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {student.name} ({student.username})
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No students available to enroll.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save Enrollment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageEnrollmentDialog;