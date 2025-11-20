"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  // Select a few products to feature on the home page
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 md:py-32 rounded-lg shadow-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Welcome to PetShop!
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Your one-stop shop for all your beloved pet's needs. Discover premium food, fun toys, and essential grooming items.
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-10 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Start Shopping <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full max-w-6xl mb-12">
        <h2 className="text-4xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="w-full max-w-6xl mb-12">
        <Card className="bg-green-500 text-white p-8 text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-2">Limited Time Offer!</CardTitle>
            <CardDescription className="text-xl text-green-100">
              Get 20% off all grooming supplies this week. Don't miss out!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/shop"> {/* You might want a specific category link here */}
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-100 text-lg px-8 py-4 mt-4">
                Shop Grooming Supplies
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Original Info Cards */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
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
      </section>
    </div>
  );
};

export default HomePage;