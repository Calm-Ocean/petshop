"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getProductById, updateProduct } from '@/lib/supabase/products'; // Import Supabase product functions
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQuery, useMutation, useQueryClient

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
    }
  }, [product]);

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      toast.success(`${updatedProduct.name} updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] }); // Invalidate specific product cache
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate categories cache in case category changed
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCurrentProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: id === 'price' || id === 'discount_price' || id === 'stock' ? parseInt(value, 10) || 0 : value, // Parse price/stock as integers
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (!currentProduct.name || !currentProduct.category || !currentProduct.description || currentProduct.price <= 0 || currentProduct.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      return;
    }

    updateProductMutation.mutate(currentProduct);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading product: {error.message}</p>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Edit Product: {currentProduct.name}</CardTitle>
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" type="text" required value={currentProduct.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" required value={currentProduct.category} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (x50, no decimals)</Label>
                <Input id="price" type="number" step="1" min="1" required value={currentProduct.price} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount_price">Discount Price (Optional) (x50, no decimals)</Label>
                <Input id="discount_price" type="number" step="1" min="0" value={currentProduct.discount_price || ''} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min="0" required value={currentProduct.stock} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required value={currentProduct.description} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input id="image_url" type="text" value={currentProduct.image_url || ''} onChange={handleInputChange} placeholder="e.g., /placeholder.svg" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending ? 'Updating Product...' : 'Update Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;