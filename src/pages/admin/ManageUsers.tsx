"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserTable from '@/components/UserTable';
import AddUserDialog from '@/components/AddUserDialog';
import EditUserDialog from '@/components/EditUserDialog';
import DeleteUserDialog from '@/components/DeleteUserDialog';
import { mockUsers, generateUniqueUserId } from '@/data/mockUsers';
import { User } from '@/context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: generateUniqueUserId(users), // Generate a unique ID
      ...newUserData,
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Users</h1>
        <AddUserDialog onAddUser={handleAddUser} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteUser}
          />
        </CardContent>
      </Card>

      {selectedUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={selectedUser}
          onEditUser={handleEditUser}
        />
      )}
    </MainLayout>
  );
};

export default ManageUsers;