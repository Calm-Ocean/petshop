"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface QRPaymentFormProps {
  totalAmount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onBack: () => void;
}

const QRPaymentForm = ({ totalAmount, onPaymentSuccess, onBack }: QRPaymentFormProps) => {
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID.");
      return;
    }

    setIsProcessing(true);
    const loadingToastId = toast.loading("Verifying payment...");

    // Simulate API call for payment verification
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    toast.dismiss(loadingToastId);

    // Mock verification logic
    if (transactionId.toLowerCase().includes('success')) { // Simple mock success condition
      toast.success("Payment verified successfully!");
      onPaymentSuccess(transactionId);
    } else {
      toast.error("Payment verification failed. Please check your transaction ID and try again.");
    }
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
        <CardDescription>Scan the QR code and enter your transaction ID.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <p className="text-lg font-semibold mb-2">Amount to Pay: ₹{totalAmount.toFixed(2)}</p>
          {/* Placeholder QR Code Image */}
          <img
            src="/placeholder.svg" // You can replace this with a real QR code image or generator
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
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Submit Transaction ID"
            )}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onBack} disabled={isProcessing}>
            Back to Shipping
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QRPaymentForm;