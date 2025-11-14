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
import { Course } from '@/data/mockCourses';

interface CourseTableProps {
  courses: Course[];
}

const CourseTable = ({ courses }: CourseTableProps) => {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;