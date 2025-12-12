"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { addProduct } from '@/lib/supabase/products'; // Import the addProduct function from Supabase service
import { Product } from '@/types/product';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient

const AddProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [product, setProduct] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    category: '',
    price: 0, // Initial price is 0
    description: '',
    image_url: 'https://images.unsplash.com/photo-1548247092-a9749397356b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default placeholder image
    stock: 0,
  });

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      toast.success(`${newProduct.name} added successfully!`);
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate categories cache
      navigate('/admin/products'); // Redirect to manage products page
    },
    onError: (error: any) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: id === 'price' || id === 'stock' ? parseInt(value, 10) || 0 : value, // Parse price/stock as integers
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.category || !product.description || product.price <= 0 || product.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      return;
    }

    addProductMutation.mutate(product);
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
                <Label htmlFor="price">Price (x50, no decimals)</Label>
                <Input id="price" type="number" step="1" min="1" required value={product.price} onChange={handleInputChange} />
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
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input id="image_url" type="text" value={product.image_url || ''} onChange={handleInputChange} placeholder="e.g., https://example.com/image.jpg" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={addProductMutation.isPending}>
              {addProductMutation.isPending ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;