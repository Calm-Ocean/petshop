"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  categoryName: string;
}

const CategoryCard = ({ categoryName }: CategoryCardProps) => {
  const [imageSrc, setImageSrc] = useState(
    `https://source.unsplash.com/random/400x300/?${categoryName.toLowerCase().replace(/\s/g, '-')}-pet`
  );
  const defaultPlaceholder = '/placeholder.svg'; // Path to your generic placeholder

  const handleImageError = () => {
    setImageSrc(defaultPlaceholder);
  };

  const description = `Explore our selection of ${categoryName.toLowerCase()} products.`;

  return (
    <Link to={`/shop?category=${categoryName}`} className="block">
      <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
        <img
          src={imageSrc}
          alt={categoryName}
          className="w-full h-48 object-cover"
          onError={handleImageError}
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