"use client";

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';
import CategoryShowcase from '@/components/CategoryShowcase'; // New import

const HomePage = () => {
  return (
    <div className="space-y-12">
      <HeroBanner />
      <CategoryShowcase /> {/* Added CategoryShowcase */}
      <ProductShowcase />
      {/* You can add more sections here later, like testimonials, etc. */}
    </div>
  );
};

export default HomePage;