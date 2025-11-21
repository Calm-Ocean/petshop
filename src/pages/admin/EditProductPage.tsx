"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        navigate('/admin/products');
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: id === 'price' || id === 'discount_price' || id === 'stock' ? (value === '' ? undefined : parseFloat(value) || 0) : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!product) return;

    if (!product.name || !product.category || !product.description || product.price <= 0 || product.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        category: product.category,
        price: product.price,
        discount_price: product.discount_price,
        description: product.description,
        image_url: product.image_url,
        stock: product.stock,
      })
      .eq('id', product.id);

    setSubmitting(false);

    if (error) {
      toast.error(`Failed to update ${product.name}: ` + error.message);
      console.error("Error updating product:", error);
    } else {
      toast.success(`${product.name} updated successfully!`);
      navigate('/admin/products');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return null; // Should be handled by navigation in useEffect
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
              <Input id="image_url" type="text" value={product.image_url} onChange={handleInputChange} placeholder="e.g., /placeholder.svg" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Updating Product...' : 'Update Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;