"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext'; // New import
import CartItem from '@/components/CartItem'; // New import
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();

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
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Your Cart ({cartItems.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <Link to="/shop">
              <Button variant="secondary">Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Link to="/checkout" className="w-full">
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;