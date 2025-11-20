"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SquarePen, Trash2, PlusCircle } from 'lucide-react';
import { mockUsers, deleteUser } from '@/data/mockUsers';
import { toast } from 'sonner';

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState(mockUsers); // Use local state to trigger re-renders

  const handleDelete = (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      if (deleteUser(userId)) {
        setUsers([...mockUsers]); // Update local state to reflect changes
        toast.success(`User ${username} deleted successfully!`);
      } else {
        toast.error(`Failed to delete user ${username}.`);
      }
    }
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Manage Users</CardTitle>
          {/* We don't have a direct "add user" page for admins yet, as registration is public */}
          {/* <Link to="/admin/users/add">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add New User
            </Button>
          </Link> */}
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end space-x-2">
                        <Link to={`/admin/users/edit/${user.id}`}>
                          <Button variant="ghost" size="icon">
                            <SquarePen className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user.id, user.username)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsersPage;