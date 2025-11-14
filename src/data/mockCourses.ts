"use client";

export interface Course {
  id: string;
  title: string;
  code: string;
  teacher: string;
  studentsEnrolled: number;
  status: 'active' | 'archived' | 'draft';
}

export const mockCourses: Course[] = [
  {
    id: 'c001',
    title: 'Introduction to Web Development',
    code: 'CS101',
    teacher: 'Teacher Jane',
    studentsEnrolled: 30,
    status: 'active',
  },
  {
    id: 'c002',
    title: 'Advanced Algorithms',
    code: 'CS301',
    teacher: 'Teacher Jane',
    studentsEnrolled: 15,
    status: 'active',
  },
  {
    id: 'c003',
    title: 'Database Management Systems',
    code: 'IT205',
    teacher: 'Teacher John',
    studentsEnrolled: 25,
    status: 'active',
  },
  {
    id: 'c004',
    title: 'Introduction to Artificial Intelligence',
    code: 'AI401',
    teacher: 'Teacher Alice',
    studentsEnrolled: 20,
    status: 'draft',
  },
  {
    id: 'c005',
    title: 'Mobile App Development',
    code: 'CS203',
    teacher: 'Teacher Bob',
    studentsEnrolled: 18,
    status: 'archived',
  },
];