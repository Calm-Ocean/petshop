"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home'); // Redirect to the e-commerce home page
  }, [navigate]);

  return null; // This page won't render anything visible
};

export default Index;