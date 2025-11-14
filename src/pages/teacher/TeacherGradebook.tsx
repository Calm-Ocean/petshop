"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { mockCourses, Course } from '@/data/mockCourses';
import { mockAssignments, Assignment } from '@/data/mockAssignments';
import { mockGrades, Grade } from '@/data/mockGrades';
import { mockUsers } from '@/data/mockUsers';
import { showError } from '@/utils/toast';
import AssignmentGradesTable from '@/components/AssignmentGradesTable';

const TeacherGradebook = () => {
  const { user } = useAuth();
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseAssignments, setCourseAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [currentGrades, setCurrentGrades] = useState<Grade[]>(mockGrades); // Use local state for grades

  useEffect(() => {
    if (user && user.role === 'teacher') {
      const filteredCourses = mockCourses.filter(course => course.teacher === user.name);
      setTeacherCourses(filteredCourses);
      if (filteredCourses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(filteredCourses[0].id); // Auto-select first course
      }
    } else {
      setTeacherCourses([]);
      showError("You must be logged in as a teacher to view this page.");
    }
  }, [user, selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      const assignmentsForCourse = mockAssignments.filter(
        (assignment) => assignment.courseId === selectedCourseId && assignment.teacherName === user?.name
      );
      setCourseAssignments(assignmentsForCourse);
      if (assignmentsForCourse.length > 0 && !selectedAssignmentId) {
        setSelectedAssignmentId(assignmentsForCourse[0].id); // Auto-select first assignment
      } else if (assignmentsForCourse.length === 0) {
        setSelectedAssignmentId(null);
      }
    } else {
      setCourseAssignments([]);
      setSelectedAssignmentId(null);
    }
  }, [selectedCourseId, user, selectedAssignmentId]);

  const handleSaveGrade = (updatedGrade: Grade) => {
    setCurrentGrades((prevGrades) => {
      const existingGradeIndex = prevGrades.findIndex(
        (g) => g.studentId === updatedGrade.studentId && g.assignmentId === updatedGrade.assignmentId
      );

      if (existingGradeIndex > -1) {
        // Update existing grade
        const newGrades = [...prevGrades];
        newGrades[existingGradeIndex] = updatedGrade;
        return newGrades;
      } else {
        // Add new grade
        return [...prevGrades, updatedGrade];
      }
    });
  };

  const selectedCourse = teacherCourses.find(course => course.id === selectedCourseId);
  const selectedAssignment = courseAssignments.find(assignment => assignment.id === selectedAssignmentId);

  // Get students enrolled in the selected course
  const studentsInSelectedCourse = selectedCourse
    ? mockUsers.filter(u => selectedCourse.studentIds.includes(u.id) && u.role === 'student')
    : [];

  // Get grades relevant to the selected assignment
  const gradesForSelectedAssignment = currentGrades.filter(
    (grade) => grade.assignmentId === selectedAssignmentId
  );

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Gradebook</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Course and Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium mb-2">Course</p>
            <Select
              onValueChange={(value) => {
                setSelectedCourseId(value);
                setSelectedAssignmentId(null); // Reset assignment selection when course changes
              }}
              value={selectedCourseId || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {teacherCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Assignment</p>
            <Select
              onValueChange={setSelectedAssignmentId}
              value={selectedAssignmentId || ''}
              disabled={!selectedCourseId || courseAssignments.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment" />
              </SelectTrigger>
              <SelectContent>
                {courseAssignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.title} (Due: {assignment.dueDate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && selectedAssignment ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Grades for "{selectedAssignment.title}" in "{selectedCourse.title}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsInSelectedCourse.length > 0 ? (
              <AssignmentGradesTable
                assignment={selectedAssignment}
                students={studentsInSelectedCourse}
                grades={gradesForSelectedAssignment}
                onSaveGrade={handleSaveGrade}
              />
            ) : (
              <p className="text-center text-muted-foreground">No students enrolled in this course.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground">
          Please select a course and an assignment to view grades.
        </p>
      )}
    </MainLayout>
  );
};

export default TeacherGradebook;