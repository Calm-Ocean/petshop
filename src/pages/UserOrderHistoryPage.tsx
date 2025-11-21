"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/product';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ArrowLeft, History } from 'lucide-react';

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

const UserOrderHistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) {
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });

      if (error) {
        toast.error("Failed to fetch your orders: " + error.message);
        console.error("Error fetching user orders:", error);
        setUserOrders([]);
      } else {
        setUserOrders(data || []);
      }
      setLoadingOrders(false);
    };

    if (!authLoading) { // Only fetch orders once auth state is resolved
      fetchUserOrders();
    }
  }, [user, authLoading]);

  if (authLoading || loadingOrders) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Loading order history...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Please log in to view your order history.
        </p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/my-account">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Account
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <History className="h-7 w-7" /> My Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              You haven't placed any orders yet.
              <div className="mt-4">
                <Link to="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{format(new Date(order.order_date), 'PPP')}</TableCell>
                      <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {/* In a real app, this would link to an OrderDetailsPage */}
                        <Button variant="ghost" size="sm" disabled>
                          View Details
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

export default UserOrderHistoryPage;