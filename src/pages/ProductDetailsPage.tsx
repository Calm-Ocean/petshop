"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { toast } from 'sonner';

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        toast.error("Failed to fetch product details: " + error.message);
        console.error("Error fetching product:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The product you are looking for does not exist.
        </p>
        <Link to="/shop">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    } else if (value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      setQuantity(product.stock);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/shop">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
          </Button>
        </Link>
      </div>

      <Card className="flex flex-col md:flex-row items-center md:items-start p-6 gap-8">
        <div className="md:w-1/2 lg:w-1/3">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 lg:w-2/3 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-4xl font-bold">{product.name}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {product.category}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-baseline space-x-4">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-primary">₹{product.discount_price.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{product.price.toFixed(2)}</span>
                  <Badge variant="destructive">
                    Save {((1 - product.discount_price / product.price) * 100).toFixed(0)}%
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">Availability:</span>
              {product.stock > 0 ? (
                <Badge variant="default">In Stock ({product.stock})</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            {product.stock > 0 && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="quantity" className="text-lg">Quantity:</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-24"
                />
              </div>
            )}
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;