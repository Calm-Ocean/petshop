"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Hello from PetShop!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        If you see this, the basic routing and layout are working.
      </p>
      <Link to="/shop">
        <Button size="lg">Go to Shop</Button>
      </Link>
    </div>
  );
};

export default HomePage;