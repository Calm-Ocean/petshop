"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4">Your Shopping Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items Section */}
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
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <Link to="/shop">
              <Button variant="secondary">Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Order Summary Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => {
              const price = item.discount_price ?? item.price;
              return (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                  <span className="line-clamp-1">{item.name} (x{item.quantity})</span>
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
              <span className="font-semibold">Free</span> {/* Placeholder for shipping */}
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
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