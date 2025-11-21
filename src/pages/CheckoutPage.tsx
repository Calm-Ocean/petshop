"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import QRPaymentForm from '@/components/QRPaymentForm';
import { supabase } from '@/integrations/supabase/client';
import { OrderItem } from '@/types/product';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: profile?.name || '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      navigate('/shop');
      return;
    }

    if (!user) {
      toast.error("You must be logged in to place an order.");
      navigate('/login');
      return;
    }

    const { fullName, address, city, zipCode, country } = shippingDetails;
    if (!fullName || !address || !city || !zipCode || !country) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    setSubmittingOrder(true);
    if (!user) {
      toast.error("User not logged in.");
      setSubmittingOrder(false);
      return;
    }

    const orderItemsForDb: OrderItem[] = cartItems.map(item => ({
      product_id: item.id,
      product_name: item.name,
      product_price: item.discount_price !== undefined ? item.discount_price : item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    }));

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          customer_name: shippingDetails.fullName,
          shipping_address: shippingDetails, // Stored as JSONB
          total_amount: cartTotal,
          status: 'pending',
          transaction_id: transactionId,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      toast.error("Failed to create order: " + orderError?.message);
      console.error("Error creating order:", orderError);
      setSubmittingOrder(false);
      return;
    }

    // Insert order items
    const orderItemsWithOrderId = orderItemsForDb.map(item => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (orderItemsError) {
      toast.error("Failed to save order items: " + orderItemsError.message);
      console.error("Error saving order items:", orderItemsError);
      // Optionally, you might want to roll back the order creation here
      setSubmittingOrder(false);
      return;
    }

    // Update product stock
    const stockUpdatePromises = cartItems.map(item =>
      supabase
        .from('products')
        .update({ stock: item.stock - item.quantity })
        .eq('id', item.id)
    );
    const stockUpdateResults = await Promise.all(stockUpdatePromises);
    stockUpdateResults.forEach((result, index) => {
      if (result.error) {
        console.error(`Failed to update stock for product ${cartItems[index].name}:`, result.error.message);
        // toast.error(`Failed to update stock for ${cartItems[index].name}.`); // Consider if this should block checkout
      }
    });


    clearCart();
    setSubmittingOrder(false);
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Your Shopping Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {!showPaymentForm ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShippingSubmit} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" type="text" required value={shippingDetails.fullName} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" type="text" required value={shippingDetails.address} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" type="text" required value={shippingDetails.city} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" type="text" required value={shippingDetails.zipCode} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" type="text" required value={shippingDetails.country} onChange={handleInputChange} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submittingOrder}>
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <QRPaymentForm
            totalAmount={cartTotal}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setShowPaymentForm(false)}
          />
        )}
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => {
              const price = item.discount_price !== undefined ? item.discount_price : item.price;
              return (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <Separator />
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping:</span>
              <span className="font-semibold">Free</span> {/* Placeholder */}
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/cart" className="w-full">
              <Button variant="outline" className="w-full" disabled={submittingOrder}>Back to Cart</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;