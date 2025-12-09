"use client";

import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { mockProducts } from '@/data/mockProducts';
import ProductCard from '@/components/ProductCard';
import { mockCategories } from '@/data/mockCategories'; // Import mock categories for title

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredProducts = categoryFilter
    ? mockProducts.filter((product) => product.category === categoryFilter)
    : mockProducts;

  const pageTitle = categoryFilter
    ? mockCategories.find(cat => cat.name === categoryFilter)?.name || 'Products'
    : 'Our Products';

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{pageTitle}</h1>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;