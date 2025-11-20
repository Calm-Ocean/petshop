"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Your Shopping Cart</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Items in your cart will appear here.
      </p>
      <Link to="/shop">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
};

export default CartPage;