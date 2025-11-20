import { UserRole } from '@/context/AuthContext';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, never store plain passwords
  role: UserRole;
  name: string;
}

export let mockUsers: User[] = [
  { id: 'admin1', username: 'admin', password: 'password', role: 'admin', name: 'Admin User' },
  { id: 'user1', username: 'user', password: 'password', role: 'user', name: 'Regular User' },
];

export const findUserByCredentials = (username: string, password: string): User | undefined => {
  return mockUsers.find((u) => u.username === username && u.password === password);
};

export const addUser = (newUser: Omit<User, 'id'>): User => {
  const id = `user${mockUsers.length + 1}`; // Simple ID generation
  const userWithId = { ...newUser, id };
  mockUsers.push(userWithId);
  return userWithId;
};

export const updateUser = (updatedUser: User): boolean => {
  const index = mockUsers.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    mockUsers[index] = updatedUser;
    return true;
  }
  return false;
};

export const deleteUser = (userId: string): boolean => {
  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter(u => u.id !== userId);
  return mockUsers.length < initialLength;
};