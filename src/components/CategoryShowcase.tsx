"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '@/data/mockCategories';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryShowcase = () => {
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <Link to="/shop">
          <Button variant="outline">
            View All Categories <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;