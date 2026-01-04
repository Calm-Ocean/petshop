"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  categoryName: string;
  imageUrl: string; // Added imageUrl prop
}

const CategoryCard = ({ categoryName, imageUrl }: CategoryCardProps) => {
  console.log(`CategoryCard: Attempting to load image for "${categoryName}" from URL: "${imageUrl}"`);
  const description = `Explore our selection of ${categoryName.toLowerCase()} products.`
  return (
    <Link to={`/shop?animalCategory=${categoryName}`} className="block"> {/* Changed to animalCategory */}
      <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
        <img
          src={imageUrl} // Using the imageUrl prop
          alt={categoryName}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error(`CategoryCard: Failed to load image for "${categoryName}" from URL: "${imageUrl}". Falling back to placeholder.`, e);
            e.currentTarget.src = '/placeholder.svg'; // Fallback to placeholder if image fails
          }}
        />
        <CardHeader className="flex-grow">
          <CardTitle className="text-lg font-semibold line-clamp-1">{categoryName}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {description}
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