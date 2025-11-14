"use client";

export interface Course {
  id: string;
  title: string;
  code: string;
  teacher: string;
  studentsEnrolled: number;
  studentIds: string[]; // New field to track enrolled students
  status: 'active' | 'archived' | 'draft';
}

export const mockCourses: Course[] = [
  {
    id: 'c001',
    title: 'Introduction to Web Development',
    code: 'CS101',
    teacher: 'Teacher Jane',
    studentsEnrolled: 3,
    studentIds: ['student1', 'student2', 'student3'],
    status: 'active',
  },
  {
    id: 'c002',
    title: 'Advanced Algorithms',
    code: 'CS301',
    teacher: 'Teacher Jane',
    studentsEnrolled: 1,
    studentIds: ['student1'],
    status: 'active',
  },
  {
    id: 'c003',
    title: 'Database Management Systems',
    code: 'IT205',
    teacher: 'Alice Smith',
    studentsEnrolled: 2,
    studentIds: ['student2', 'student3'],
    status: 'active',
  },
  {
    id: 'c004',
    title: 'Introduction to Artificial Intelligence',
    code: 'AI401',
    teacher: 'Alice Smith',
    studentsEnrolled: 0,
    studentIds: [],
    status: 'draft',
  },
  {
    id: 'c005',
    title: 'Mobile App Development',
    code: 'CS203',
    teacher: 'Teacher Jane',
    studentsEnrolled: 0,
    studentIds: [],
    status: 'archived',
  },
];