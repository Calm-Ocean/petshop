"use client";

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';
import CategoryShowcase from '@/components/CategoryShowcase';

const HomePage = () => {
  return (
    <div className="space-y-12">
      <HeroBanner />
      <CategoryShowcase />
      <ProductShowcase />
    </div>
  );
};

export default HomePage;