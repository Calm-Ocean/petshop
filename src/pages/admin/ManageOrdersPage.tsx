"use client";

import React from 'react';
import { Link } from 'react-router-dom';
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
import { Order } from '@/types/order'; // Import Order type from new type file
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import { getAllOrders, updateOrderStatus as updateSupabaseOrderStatus } from '@/lib/supabase/orders'; // Import Supabase order functions

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'default';
    case 'shipped':
      return 'secondary';
    case 'processing':
      return 'outline';
    case 'pending':
      return 'destructive';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const ManageOrdersPage = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: getAllOrders,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: Order['status'] }) =>
      updateSupabaseOrderStatus(orderId, newStatus),
    onSuccess: (_, variables) => {
      toast.success(`Order ${variables.orderId} status updated to ${variables.newStatus}.`);
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] }); // Invalidate cache to refetch orders
      queryClient.invalidateQueries({ queryKey: ['userOrders'] }); // Invalidate user orders as well
    },
    onError: (err: any) => {
      toast.error(`Failed to update order status: ${err.message}`);
    },
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatusMutation.mutate({ orderId, newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select value={order.status} onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
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

export default ManageOrdersPage;