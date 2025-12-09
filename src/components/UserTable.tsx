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
import { Button } from '@/components/ui/button';
import { SquarePen, Trash2 } from 'lucide-react';
import { User } from '@/context/AuthContext'; // Import User type

interface UserTableProps {
  users: User[];
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

const UserTable = ({ users, onEditClick, onDeleteClick }: UserTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    user.role === 'admin'
                      ? 'destructive'
                      : user.role === 'teacher'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {user.role?.charAt(0).toUpperCase() + user.role!.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEditClick(user)}>
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDeleteClick(user)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;