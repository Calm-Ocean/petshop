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
import { mockProducts, deleteProduct } from '@/data/mockProducts';
import { toast } from 'sonner';

const ManageProductsPage = () => {
  const navigate = useNavigate();

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      if (deleteProduct(productId)) {
        toast.success(`${productName} deleted successfully!`);
        // Force re-render by navigating to a dummy route and back, or by updating state
        navigate(0); // Reloads the current route
      } else {
        toast.error(`Failed to delete ${productName}.`);
      }
    }
  };

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
          {mockProducts.length === 0 ? (
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
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="text-sm line-through text-muted-foreground">${product.price.toFixed(2)}</span>
                            <span className="font-semibold">${product.discountPrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-semibold">${product.price.toFixed(2)}</span>
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
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id, product.name)}>
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