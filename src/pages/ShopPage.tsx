"use client";

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getProducts, getCategories } from '@/lib/supabase/products'; // Import Supabase product functions
import CategoryFilter from '@/components/CategoryFilter'; // New import

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products', categoryFilter],
    queryFn: () => getProducts(categoryFilter || undefined),
  });

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const pageTitle = categoryFilter
    ? categories?.find(catName => catName === categoryFilter) || 'Products'
    : 'Our Products';

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (productsError || categoriesError) {
    return <div className="text-center py-12 text-destructive">Error loading products: {productsError?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar for Category Filter */}
      <div className="lg:col-span-1">
        <CategoryFilter />
      </div>

      {/* Main content area for products */}
      <div className="lg:col-span-3">
        <h1 className="text-4xl font-bold text-center mb-8">{pageTitle}</h1>
        {products && products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"> {/* Adjusted grid for products */}
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;