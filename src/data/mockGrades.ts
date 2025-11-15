"use client";

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  courseId: string;
  score: number | null; // Null if not yet graded
  feedback: string | null;
  status: 'graded' | 'submitted' | 'not_submitted';
  submittedFileName?: string | null; // New field to store the name of the file submitted by the student
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
    submittedFileName: 'student1_a001_submission.zip',
  },
  {
    id: 'g002',
    studentId: 'student2',
    assignmentId: 'a001',
    courseId: 'c001',
    score: 92,
    feedback: 'Excellent work!',
    status: 'graded',
    submittedFileName: 'student2_a001_solution.pdf',
  },
  {
    id: 'g003',
    studentId: 'student3',
    assignmentId: 'a001',
    courseId: 'c001',
    score: null,
    feedback: null,
    status: 'submitted',
    submittedFileName: 'student3_a001_draft.zip',
  },
  {
    id: 'g004',
    studentId: 'student1',
    assignmentId: 'a002',
    courseId: 'c001',
    score: null,
    feedback: null,
    status: 'not_submitted',
    submittedFileName: null,
  },
  {
    id: 'g005',
    studentId: 'student2',
    assignmentId: 'a003',
    courseId: 'c003',
    score: 78,
    feedback: 'Understand JOINs better.',
    status: 'graded',
    submittedFileName: 'student2_a003_queries.sql',
  },
  {
    id: 'g006',
    studentId: 'student3',
    assignmentId: 'a003',
    courseId: 'c003',
    score: 88,
    feedback: 'Solid SQL skills.',
    status: 'graded',
    submittedFileName: 'student3_a003_final.sql',
  },
  {
    id: 'g007',
    studentId: 'student1',
    assignmentId: 'a004',
    courseId: 'c002',
    score: null,
    feedback: null,
    status: 'submitted',
    submittedFileName: 'student1_a004_report.pdf',
  },
];