"use client";

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getProducts, getCategories } from '@/lib/supabase/products'; // Import Supabase product functions

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
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{pageTitle}</h1>
      {products && products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;