"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Home } from 'lucide-react';

const UserAddressPage = () => {
  const navigate = useNavigate();
  const { user, isLoadingAuth, refetchUserProfile } = useAuth(); // Assuming refetchUserProfile will be added to AuthContext
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    city: '',
    zip_code: '',
    country: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && user) {
      setAddressDetails({
        address: user.address || '',
        city: user.city || '',
        zip_code: user.zip_code || '',
        country: user.country || '',
      });
    }
  }, [user, isLoadingAuth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your address.");
      navigate('/login');
      return;
    }

    const { address, city, zip_code, country } = addressDetails;
    if (!address || !city || !zip_code || !country) {
      toast.error("Please fill in all address fields.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          address,
          city,
          zip_code,
          country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Address updated successfully!");
      refetchUserProfile(); // Refresh user profile in context
      navigate('/my-account'); // Redirect to account page
    } catch (error: any) {
      console.error('Error updating address:', error);
      toast.error(`Failed to update address: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Please log in to manage your address.
        </p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Home className="h-7 w-7" /> My Address
          </CardTitle>
          <CardDescription>
            Please provide your shipping address details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" required value={addressDetails.address} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" required value={addressDetails.city} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input id="zip_code" type="text" required value={addressDetails.zip_code} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" type="text" required value={addressDetails.country} onChange={handleInputChange} />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Address'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAddressPage;