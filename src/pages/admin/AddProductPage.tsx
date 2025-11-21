"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    category: '',
    price: 0,
    discount_price: undefined,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1548247092-a9749397356b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default placeholder image
    stock: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: id === 'price' || id === 'discount_price' || id === 'stock' ? (value === '' ? undefined : parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!product.name || !product.category || !product.description || product.price <= 0 || product.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          category: product.category,
          price: product.price,
          discount_price: product.discount_price,
          description: product.description,
          image_url: product.image_url,
          stock: product.stock,
        },
      ])
      .select();

    setLoading(false);

    if (error) {
      toast.error("Failed to add product: " + error.message);
      console.error("Error adding product:", error);
    } else {
      toast.success(`${product.name} added successfully!`);
      navigate('/admin/products'); // Redirect to manage products page
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Add New Product</CardTitle>
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
                <Label htmlFor="discount_price">Discount Price (Optional)</Label>
                <Input id="discount_price" type="number" step="0.01" min="0" value={product.discount_price || ''} onChange={handleInputChange} />
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
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input id="image_url" type="text" value={product.image_url} onChange={handleInputChange} placeholder="e.g., https://example.com/image.jpg" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;