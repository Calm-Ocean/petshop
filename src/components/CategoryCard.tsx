"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/shop?category=${category.name}`} className="block">
      <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-48 object-cover"
        />
        <CardHeader className="flex-grow">
          <CardTitle className="text-lg font-semibold line-clamp-1">{category.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Add any additional content or buttons here if needed */}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;