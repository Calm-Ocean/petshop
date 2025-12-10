"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/supabase/products';
import { CATEGORY_IMAGES, ANIMAL_CATEGORIES } from '@/constants/categories'; // Import CATEGORY_IMAGES and ANIMAL_CATEGORIES

const CategoryShowcase = () => {
  // We'll use ANIMAL_CATEGORIES directly for the showcase, as they are the main categories.
  // The getCategories query is still useful for other parts of the app if needed,
  // but for the showcase, we want specific, predefined categories.

  // For the showcase, we'll iterate over ANIMAL_CATEGORIES directly.
  // No need for a separate query for this specific component's display.
  const featuredCategories = ANIMAL_CATEGORIES.slice(0, 4); // Display first 4 animal categories

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
        {featuredCategories.map((categoryName) => (
          <CategoryCard
            key={categoryName}
            categoryName={categoryName}
            imageUrl={CATEGORY_IMAGES[categoryName] || '/placeholder.svg'} // Pass image URL
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;