"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssignmentTable from '@/components/AssignmentTable';
import AddAssignmentDialog from '@/components/AddAssignmentDialog';
import EditAssignmentDialog from '@/components/EditAssignmentDialog';
import DeleteAssignmentDialog from '@/components/DeleteAssignmentDialog';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const TeacherAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      // Filter assignments to only show those created by the logged-in teacher
      const filteredAssignments = mockAssignments.filter(assignment => assignment.teacherName === user.name);
      setAssignments(filteredAssignments);
    } else {
      setAssignments([]);
      showError("You must be logged in as a teacher to view this page.");
    }
  }, [user]);

  const handleAddAssignment = (newAssignmentData: Omit<Assignment, 'id' | 'teacherName'>) => {
    if (!user || user.role !== 'teacher') return;

    const newAssignment: Assignment = {
      id: `a${assignments.length + 1}`, // Simple ID generation for mock data
      teacherName: user.name,
      ...newAssignmentData,
    };
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
  };

  const handleEditClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditDialogOpen(true);
  };

  const handleEditAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments((prevAssignments) => prevAssignments.filter((assignment) => assignment.id !== assignmentId));
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Assignments</h1>
        <AddAssignmentDialog onAddAssignment={handleAddAssignment} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <AssignmentTable
              assignments={assignments}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteAssignment}
            />
          ) : (
            <p className="text-center text-muted-foreground">No assignments found for your courses.</p>
          )}
        </CardContent>
      </Card>

      {selectedAssignment && (
        <EditAssignmentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          assignment={selectedAssignment}
          onEditAssignment={handleEditAssignment}
        />
      )}
    </MainLayout>
  );
};

export default TeacherAssignments;