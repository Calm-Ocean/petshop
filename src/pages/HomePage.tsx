"use client";

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';

const HomePage = () => {
  return (
    <div className="space-y-12">
      <HeroBanner />
      <ProductShowcase />
      {/* You can add more sections here later, like testimonials, categories, etc. */}
    </div>
  );
};

export default HomePage;