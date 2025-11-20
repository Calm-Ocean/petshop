"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-6">
        Welcome to PetShop!
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Your one-stop shop for all your beloved pet's needs. From nutritious food to fun toys and essential grooming items, we have it all!
      </p>
      <div className="flex justify-center space-x-4 mb-12">
        <Link to="/shop">
          <Button size="lg" className="text-lg px-8 py-4">
            Start Shopping
          </Button>
        </Link>
        <Link to="/about">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            Learn More
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Card className="p-6 text-left">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quality Products</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We handpick the best products to ensure your pets get nothing but the finest.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="p-6 text-left">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Fast Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get your pet's essentials delivered right to your doorstep, quickly and reliably.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="p-6 text-left">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Happy Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our mission is to make every tail wag and every purr louder!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;