"use client";

import { User, UserRole } from '@/context/AuthContext';

// Extending the mock users from AuthContext for more examples
export const mockUsers: User[] = [
  { id: 'admin1', username: 'admin', password: 'password', role: 'admin', name: 'Admin User' },
  { id: 'teacher1', username: 'teacher', password: 'password', role: 'teacher', name: 'Teacher Jane' },
  { id: 'student1', username: 'student', password: 'password', role: 'student', name: 'Student John' },
  { id: 'teacher2', username: 'alice', password: 'password', role: 'teacher', name: 'Alice Smith' },
  { id: 'student2', username: 'bob', password: 'password', role: 'student', name: 'Bob Johnson' },
  { id: 'student3', username: 'charlie', password: 'password', role: 'student', name: 'Charlie Brown' },
];

// This function is just for demonstration to simulate adding a user with a unique ID
export const generateUniqueUserId = (existingUsers: User[]): string => {
  let newId: string;
  let counter = existingUsers.length + 1;
  do {
    newId = `u${counter.toString().padStart(3, '0')}`;
    counter++;
  } while (existingUsers.some(user => user.id === newId));
  return newId;
};