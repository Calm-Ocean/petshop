"use client";

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// Removed useQuery and getCategories import as we're using predefined categories
// import { useQuery } from '@tanstack/react-query';
// import { getCategories } from '@/lib/supabase/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter } from 'lucide-react';
import { ANIMAL_CATEGORIES } from '@/constants/categories'; // Import ANIMAL_CATEGORIES

const CategoryFilter = () => {
  const [searchParams] = useSearchParams();
  const activeAnimalCategory = searchParams.get('animalCategory');
  const activeSpecificCategory = searchParams.get('category'); // Keep this for now, though it might be less used

  // Removed useQuery for getCategories as we are using predefined ANIMAL_CATEGORIES
  // if (isLoading) {
  //   return <div className="p-4 text-muted-foreground">Loading categories...</div>;
  // }
  // if (error) {
  //   return <div className="p-4 text-destructive">Error: {error.message}</div>;
  // }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListFilter className="h-5 w-5" /> Filter by Animal
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Link to="/shop"> {/* Link to clear all filters */}
          <Button
            variant={!activeAnimalCategory && !activeSpecificCategory ? 'secondary' : 'ghost'}
            className="w-full justify-start text-ellipsis overflow-hidden whitespace-nowrap"
          >
            All Products
          </Button>
        </Link>
        {ANIMAL_CATEGORIES.map((categoryName) => (
          <Link key={categoryName} to={`/shop?animalCategory=${categoryName}`}>
            <Button
              variant={activeAnimalCategory === categoryName ? 'secondary' : 'ghost'}
              className="w-full justify-start text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {categoryName}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;