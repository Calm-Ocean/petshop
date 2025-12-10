"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // New import

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart(); // Use cart context

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/shop/${product.id}`} className="block">
        <img
          src={product.image_url || 'https://via.placeholder.com/400'} // Corrected to image_url
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </CardDescription>
        <Badge variant="secondary" className="mt-2 self-start">
          {product.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        {product.discount_price ? (
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-primary">₹{product.discount_price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.price.toFixed(2)}</span>
          </div>
        ) : (
          <span className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
        )}
        {product.stock === 0 ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : (
          <span className="text-sm text-muted-foreground">In Stock: {product.stock}</span>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Link to={`/shop/${product.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Button disabled={product.stock === 0} onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;