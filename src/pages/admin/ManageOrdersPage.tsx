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
import { mockOrders, updateOrderStatus, Order } from '@/data/mockOrders';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [orders, setOrders] = React.useState(mockOrders);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (updateOrderStatus(orderId, newStatus)) {
      setOrders([...mockOrders]); // Force re-render with updated mock data
      toast.success(`Order ${orderId} status updated to ${newStatus}.`);
    } else {
      toast.error(`Failed to update status for order ${orderId}.`);
    }
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
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
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
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