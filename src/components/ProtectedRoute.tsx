"use client";

import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      showError('You need to log in to access this page.');
      navigate('/');
    } else if (role && !allowedRoles.includes(role)) {
      showError('You do not have permission to access this page.');
      navigate('/dashboard'); // Redirect to generic dashboard or unauthorized page
    }
  }, [user, role, navigate, allowedRoles]);

  if (!user || (role && !allowedRoles.includes(role))) {
    return null; // Or a loading spinner, as the redirect will happen
  }

  return <>{children}</>;
};

export default ProtectedRoute;