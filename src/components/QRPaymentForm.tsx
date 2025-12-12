"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface QRPaymentFormProps {
  totalAmount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onBack: () => void;
}

const QRPaymentForm = ({ totalAmount, onPaymentSuccess, onBack }: QRPaymentFormProps) => {
  const [transactionId, setTransactionId] = useState('');

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID.");
      return;
    }

    // No immediate verification. Just submit the ID.
    toast.info("Transaction ID submitted. Your order is awaiting payment verification.");
    onPaymentSuccess(transactionId);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
        <CardDescription>Scan the QR code and enter your transaction ID.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <p className="text-lg font-semibold mb-2">Amount to Pay: ₹{totalAmount.toFixed(0)}</p>
          {/* Updated QR Code Image */}
          <img
            src="https://raw.githubusercontent.com/Calm-Ocean/web_dev_petstore/main/WhatsApp%20Image%202025-11-22%20at%2011.19.02.jpeg"
            alt="Payment QR Code"
            className="w-48 h-48 object-contain border p-2 rounded-md bg-white"
          />
          <p className="text-sm text-muted-foreground mt-2">Scan this QR code with your preferred payment app.</p>
        </div>

        <form onSubmit={handleTransactionSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              type="text"
              placeholder="Enter your transaction ID"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Payment
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onBack}>
            Back to Shipping
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QRPaymentForm;