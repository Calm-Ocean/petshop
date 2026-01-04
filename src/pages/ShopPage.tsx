"use client";

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/lib/supabase/products';
import CategoryFilter from '@/components/CategoryFilter';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/product';
import { ANIMAL_CATEGORIES } from '@/constants/categories';
// Removed SearchBar import

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category'); // Specific category from sidebar (less used now)
  const animalCategoryFilter = searchParams.get('animalCategory'); // Broad animal category from navbar/sidebar
  const searchTerm = searchParams.get('search'); // Get search term from URL

  console.log('ShopPage: Current search term from URL:', searchTerm);
  console.log('ShopPage: Category filter from URL:', categoryFilter);
  console.log('ShopPage: Animal Category filter from URL:', animalCategoryFilter);

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products', categoryFilter, animalCategoryFilter, searchTerm], // Add searchTerm to queryKey
    queryFn: () => {
      console.log('ShopPage: Calling getProducts with category:', categoryFilter || animalCategoryFilter || 'none', 'and searchTerm:', searchTerm || 'none');
      // Pass the animalCategoryFilter directly to getProducts
      return getProducts(animalCategoryFilter || categoryFilter || undefined, searchTerm || undefined);
    },
  });

  const { data: allCategories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  let pageTitle = 'Our Products';
  if (searchTerm) {
    pageTitle = `Search Results for "${searchTerm}"`;
  } else if (animalCategoryFilter) {
    pageTitle = `${animalCategoryFilter} Products`;
  } else if (categoryFilter) {
    // This path is less likely to be hit with the new animalCategory focus, but kept for robustness
    pageTitle = allCategories?.find(catName => catName === categoryFilter) || 'Products';
  }

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (productsError || categoriesError) {
    return (
      <div className="text-center py-12 text-destructive">
        Error loading products: {productsError?.message || categoriesError?.message}
      </div>
    );
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
            No products found matching your criteria.
          </div>
        ) : (
          // Always display a flat list of products, as filtering is handled by getProducts
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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