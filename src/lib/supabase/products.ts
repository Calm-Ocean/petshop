import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

// Helper to convert price from cents to a readable format
const formatProductPrices = (product: any): Product => ({
  ...product,
  price: product.price / 100,
  discount_price: product.discount_price ? product.discount_price / 100 : null,
});

// Fetch all products, optionally filtered by category
export const getProducts = async (category?: string): Promise<Product[]> => {
  let query = supabase.from('products').select('*');

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data.map(formatProductPrices);
};

// Fetch a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching product by ID:', error);
    throw error;
  }

  return data ? formatProductPrices(data) : null;
};

// Fetch unique categories from products
export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
  return uniqueCategories;
};

// Add a new product (for admin)
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      price: product.price * 100, // Convert to cents for storage
      discount_price: product.discount_price ? product.discount_price * 100 : null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return formatProductPrices(data);
};

// Update an existing product (for admin)
export const updateProduct = async (product: Product): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...product,
      price: product.price * 100, // Convert to cents for storage
      discount_price: product.discount_price ? product.discount_price * 100 : null,
    })
    .eq('id', product.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return formatProductPrices(data);
};

// Delete a product (for admin)
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};