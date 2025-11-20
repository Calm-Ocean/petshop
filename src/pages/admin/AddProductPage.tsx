"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { addProduct } from '@/data/mockProducts'; // Import the addProduct function
import { Product } from '@/types/product';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    description: '',
    imageUrl: '/placeholder.svg', // Default placeholder image
    stock: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: id === 'price' || id === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.category || !product.description || product.price <= 0 || product.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      return;
    }

    addProduct(product);
    toast.success(`${product.name} added successfully!`);
    navigate('/shop'); // Redirect to shop page to see the new product
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add New Product</CardTitle>
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
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" required value={product.stock} onChange={handleInputChange} />
              </div>
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
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;