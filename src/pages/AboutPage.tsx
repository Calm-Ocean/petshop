"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn more about PetShop and our mission.
      </p>
      <Link to="/home">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default AboutPage;