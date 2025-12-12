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
import { createOrder } from '@/lib/supabase/orders';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zip_code || '',
    country: user?.country || '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
    if (!user) {
      toast.error("User not authenticated.");
      navigate('/login');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await createOrder(
        user.id,
        shippingDetails.fullName,
        shippingDetails,
        cartItems,
        cartTotal,
        transactionId
      );

      clearCart();
      toast.success("Order placed successfully! Awaiting payment verification.");
      navigate('/order-confirmation');
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsPlacingOrder(false);
    }
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
                <Button type="submit" size="lg" className="w-full">
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
              const price = item.discount_price ?? item.price; // Fixed: Use nullish coalescing
              return (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(price * item.quantity).toFixed(0)}</span>
                </div>
              );
            })}
            <Separator />
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping:</span>
              <span className="font-semibold">Free</span> {/* Placeholder */}
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/cart" className="w-full">
              <Button variant="outline" className="w-full">Back to Cart</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;