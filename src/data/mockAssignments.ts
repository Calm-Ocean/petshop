"use client";

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD format
  status: 'pending' | 'graded' | 'submitted';
  teacherName: string; // To link with teacher's courses
}

export const mockAssignments: Assignment[] = [
  {
    id: 'a001',
    courseId: 'c001',
    title: 'Introduction to HTML/CSS',
    dueDate: '2024-10-15',
    status: 'pending',
    teacherName: 'Teacher Jane',
  },
  {
    id: 'a002',
    courseId: 'c001',
    title: 'JavaScript Basics',
    dueDate: '2024-10-22',
    status: 'pending',
    teacherName: 'Teacher Jane',
  },
  {
    id: 'a003',
    courseId: 'c003',
    title: 'SQL Queries',
    dueDate: '2024-11-01',
    status: 'graded',
    teacherName: 'Alice Smith',
  },
  {
    id: 'a004',
    courseId: 'c002',
    title: 'Algorithm Analysis',
    dueDate: '2024-11-10',
    status: 'submitted',
    teacherName: 'Teacher Jane',
  },
];