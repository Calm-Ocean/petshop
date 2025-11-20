"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CheckoutPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Checkout</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Proceed with your order.
      </p>
      <Link to="/cart">
        <Button>Back to Cart</Button>
      </Link>
    </div>
  );
};

export default CheckoutPage;