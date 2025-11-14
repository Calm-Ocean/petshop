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
import { SquarePen } from 'lucide-react';
import { Course } from '@/data/mockCourses';

interface CourseTableProps {
  courses: Course[];
  onEditClick: (course: Course) => void; // New prop for edit action
}

const CourseTable = ({ courses, onEditClick }: CourseTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead className="text-right">Enrolled Students</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead> {/* New column for actions */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.code}</TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.teacher}</TableCell>
              <TableCell className="text-right">{course.studentsEnrolled}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    course.status === 'active'
                      ? 'default'
                      : course.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEditClick(course)}>
                  <SquarePen className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;