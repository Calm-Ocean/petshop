"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SquarePen, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts, deleteProduct } from '@/lib/supabase/products'; // Import Supabase product functions
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQuery, useMutation, useQueryClient

const ManageProductsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, productId) => {
      toast.success(`Product deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate categories cache
    },
    onError: (error: any) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Manage Products</CardTitle>
          <Link to="/admin/products/add">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Product
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {products && products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found. Add some to get started!
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.discount_price ? (
                          <div className="flex flex-col">
                            <span className="text-sm line-through text-muted-foreground">₹{product.price.toFixed(2)}</span>
                            <span className="font-semibold">₹{product.discount_price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-semibold">₹{product.price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end space-x-2">
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Button variant="ghost" size="icon">
                            <SquarePen className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageProductsPage;