"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getCategories } from '@/lib/supabase/products'; // Import getCategories

const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Log the fetched categories to the console for debugging
  console.log("Categories in CategoryShowcase:", { categories, isLoading, error });

  if (isLoading) {
    return <div className="text-center py-12">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading categories: {error.message}</div>;
  }

  // Display a limited number of categories for the showcase, e.g., first 4
  const featuredCategories = categories?.slice(0, 4) || [];

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
          <CategoryCard key={categoryName} categoryName={categoryName} />
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;