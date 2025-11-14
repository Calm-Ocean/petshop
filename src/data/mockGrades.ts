"use client";

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  courseId: string;
  score: number | null; // Null if not yet graded
  feedback: string | null;
  status: 'graded' | 'submitted' | 'not_submitted';
}

export const mockGrades: Grade[] = [
  {
    id: 'g001',
    studentId: 'student1',
    assignmentId: 'a001',
    courseId: 'c001',
    score: 85,
    feedback: 'Good effort, focus on CSS specificity.',
    status: 'graded',
  },
  {
    id: 'g002',
    studentId: 'student2',
    assignmentId: 'a001',
    courseId: 'c001',
    score: 92,
    feedback: 'Excellent work!',
    status: 'graded',
  },
  {
    id: 'g003',
    studentId: 'student3',
    assignmentId: 'a001',
    courseId: 'c001',
    score: null,
    feedback: null,
    status: 'submitted',
  },
  {
    id: 'g004',
    studentId: 'student1',
    assignmentId: 'a002',
    courseId: 'c001',
    score: null,
    feedback: null,
    status: 'not_submitted',
  },
  {
    id: 'g005',
    studentId: 'student2',
    assignmentId: 'a003',
    courseId: 'c003',
    score: 78,
    feedback: 'Understand JOINs better.',
    status: 'graded',
  },
  {
    id: 'g006',
    studentId: 'student3',
    assignmentId: 'a003',
    courseId: 'c003',
    score: 88,
    feedback: 'Solid SQL skills.',
    status: 'graded',
  },
  {
    id: 'g007',
    studentId: 'student1',
    assignmentId: 'a004',
    courseId: 'c002',
    score: null,
    feedback: null,
    status: 'submitted',
  },
];