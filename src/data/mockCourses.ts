"use client";

export interface Course {
  id: string;
  title: string;
  code: string;
  teacher: string;
  studentsEnrolled: number;
  studentIds: string[]; // New field to track enrolled students
  status: 'active' | 'archived' | 'draft';
  description: string; // New field
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
    description: 'This course provides a comprehensive introduction to web development, covering HTML, CSS, and JavaScript fundamentals. Students will learn to build responsive and interactive web pages.',
  },
  {
    id: 'c002',
    title: 'Advanced Algorithms',
    code: 'CS301',
    teacher: 'Teacher Jane',
    studentsEnrolled: 1,
    studentIds: ['student1'],
    status: 'active',
    description: 'Dive deep into the design and analysis of advanced algorithms. Topics include graph algorithms, dynamic programming, network flow, and computational geometry.',
  },
  {
    id: 'c003',
    title: 'Database Management Systems',
    code: 'IT205',
    teacher: 'Alice Smith',
    studentsEnrolled: 2,
    studentIds: ['student2', 'student3'],
    status: 'active',
    description: 'Learn the principles and practices of database management systems, including relational database design, SQL, transaction management, and database security.',
  },
  {
    id: 'c004',
    title: 'Introduction to Artificial Intelligence',
    code: 'AI401',
    teacher: 'Alice Smith',
    studentsEnrolled: 0,
    studentIds: [],
    status: 'draft',
    description: 'An introductory course to the field of Artificial Intelligence, exploring fundamental concepts, techniques, and applications such as search algorithms, machine learning, and natural language processing.',
  },
  {
    id: 'c005',
    title: 'Mobile App Development',
    code: 'CS203',
    teacher: 'Teacher Jane',
    studentsEnrolled: 0,
    studentIds: [],
    status: 'archived',
    description: 'This course covers the basics of developing mobile applications for iOS and Android platforms using cross-platform frameworks. Focus will be on UI/UX design, data persistence, and API integration.',
  },
];