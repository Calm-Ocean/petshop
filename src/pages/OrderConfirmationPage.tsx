"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage = () => {
  useEffect(() => {
    // In a real application, you might fetch order details here
    // or display details passed via state/query params.
    // For now, it's a simple confirmation message.
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-4">
        Order Received!
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Thank you for your purchase. We will confirm your order, please give us 1 working day.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/shop">
          <Button size="lg" className="text-lg px-8 py-4">
            Continue Shopping
          </Button>
        </Link>
        <Link to="/home">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;