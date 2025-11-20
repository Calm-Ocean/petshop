"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ShopPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Our Products</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Browse our wide selection of pet products.
      </p>
      <Link to="/home">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default ShopPage;