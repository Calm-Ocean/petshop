import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

// Helper to ensure prices are numbers and handle nulls for discount_price
const formatProductPrices = (product: any): Product => {
  const formattedProduct = {
    ...product,
    price: parseFloat(product.price) || 0,
    discount_price: product.discount_price ? parseFloat(product.discount_price) : null,
  };
  console.log(`Supabase Products Service: Formatted product ${formattedProduct.name} (ID: ${formattedProduct.id}): Description: "${formattedProduct.description}"`);
  return formattedProduct;
};

// Fetch all products, optionally filtered by category or search term
export const getProducts = async (category?: string, searchTerm?: string): Promise<Product[]> => {
  console.log('Supabase Products Service: Fetching products with category:', category, 'and searchTerm:', searchTerm);
  let query = supabase.from('products').select('*');

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  if (searchTerm) {
    const searchConditions = [
      `name.ilike.%${searchTerm}%`,
      `description.ilike.%${searchTerm}%`,
      `brand.ilike.%${searchTerm}%`,
      `category.ilike.%${searchTerm}%`,
    ];
    const orConditionString = searchConditions.join(',');
    console.log('Supabase Products Service: Applying OR condition:', orConditionString);
    query = query.or(orConditionString);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) {
    console.error('Supabase Products Service: Error fetching products:', error);
    throw error;
  }

  console.log('Supabase Products Service: Raw data from Supabase:', data);
  const formattedData = data.map(formatProductPrices);
  console.log('Supabase Products Service: Formatted products data:', formattedData);
  return formattedData;
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
  
  // Process category names: remove "pet supplies" and trim
  const processedCategories = uniqueCategories.map(category => 
    category.replace(/pet supplies/gi, '').trim()
  ).filter(Boolean); // Filter out empty strings if "pet supplies" was the only content

  return processedCategories;
};

// Add a new product (for admin)
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      price: product.price, 
      discount_price: product.discount_price || null,
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
      price: product.price,
      discount_price: product.discount_price || null,
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