"use client";

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/supabase/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter } from 'lucide-react';

const CategoryFilter = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">Error: {error.message}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListFilter className="h-5 w-5" /> Filter by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Link to="/shop">
          <Button
            variant={!activeCategory ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            All Products
          </Button>
        </Link>
        {categories?.map((categoryName) => (
          <Link key={categoryName} to={`/shop?category=${categoryName}`}>
            <Button
              variant={activeCategory === categoryName ? 'secondary' : 'ghost'}
              className="w-full justify-start"
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