"use client";

import React from 'react';
import { Assignment } from '@/data/mockAssignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format, isToday, isTomorrow } from 'date-fns';

interface AssignmentCalendarViewProps {
  assignments: Assignment[];
  title: string;
  emptyMessage: string;
}

const AssignmentCalendarView = ({ assignments, title, emptyMessage }: AssignmentCalendarViewProps) => {
  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  // Group assignments by due date
  const assignmentsByDate: { [key: string]: Assignment[] } = assignments.reduce((acc, assignment) => {
    const dateKey = assignment.dueDate; // YYYY-MM-DD
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(assignment);
    return acc;
  }, {} as { [key: string]: Assignment[] });

  // Sort dates
  const sortedDates = Object.keys(assignmentsByDate).sort();

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDates.map((dateKey, index) => (
          <div key={dateKey} className="mb-4 last:mb-0">
            <h3 className="text-lg font-semibold mb-2">
              {getFormattedDate(dateKey)}
            </h3>
            <div className="space-y-2">
              {assignmentsByDate[dateKey].map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">Course: {assignment.courseId}</p>
                  </div>
                  <Badge
                    variant={
                      assignment.status === 'pending'
                        ? 'secondary'
                        : assignment.status === 'graded'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
            {index < sortedDates.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssignmentCalendarView;