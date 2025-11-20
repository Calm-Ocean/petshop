"use client";

import React from 'react';
import { mockProducts } from '@/data/mockProducts';
import ProductCard from '@/components/ProductCard';

const ShopPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;