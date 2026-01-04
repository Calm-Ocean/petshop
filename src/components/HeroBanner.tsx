"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Background image or pattern */}
        <img
          src="https://t4.ftcdn.net/jpg/02/69/47/89/360_F_269478900_EEEXPJa7ohrxraL6L6V2GlmltteALheQ.jpg"
          alt="Pets background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
          Welcome to PetShop!
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Your one-stop destination for all your beloved pets' needs.
          From nutritious food to fun toys, we have it all!
        </p>
        <Link to="/shop">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-md hover:shadow-lg transition-all duration-300">
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;
