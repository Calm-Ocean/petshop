"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // Redirect to the login page
  }, [navigate]);

  return null; // This page won't render anything visible
};

export default Index;