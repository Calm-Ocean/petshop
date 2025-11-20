"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role } = useAuth();

  if (!user) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  } else {
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoute;