"use client";

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    // Still loading auth state, render nothing or a loading spinner
    return null;
  }

  if (!user) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if address details are complete
  const isAddressComplete = user.address && user.city && user.zip_code && user.country;
  const isOnAddressPage = location.pathname === '/my-account/address';

  if (!isAddressComplete && !isOnAddressPage) {
    toast.error("Please complete your address details to proceed.");
    return <Navigate to="/my-account/address" replace state={{ from: location }} />;
  }

  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  } else {
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoute;