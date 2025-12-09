"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { mockProducts, updateProduct } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      toast.error("Product not found.");
      navigate('/admin/products');
    }
  }, [productId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: id === 'price' || id === 'discountPrice' || id === 'stock' ? parseFloat(value) || 0 : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!product.name || !product.category || !product.description || product.price <= 0 || product.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      return;
    }

    if (updateProduct(product)) {
      toast.success(`${product.name} updated successfully!`);
      navigate('/admin/products');
    } else {
      toast.error(`Failed to update ${product.name}.`);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Edit Product: {product.name}</CardTitle>
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" type="text" required value={product.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" required value={product.category} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" min="0.01" required value={product.price} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
                <Input id="discountPrice" type="number" step="0.01" min="0" value={product.discountPrice || ''} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min="0" required value={product.stock} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required value={product.description} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" type="text" value={product.imageUrl} onChange={handleInputChange} placeholder="e.g., /placeholder.svg" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Update Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;