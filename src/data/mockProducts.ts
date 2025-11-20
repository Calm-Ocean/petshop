import { Product } from '@/types/product';

export let mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Premium Dog Food',
    category: 'Food',
    price: 45.99,
    discountPrice: 39.99,
    description: 'High-quality dog food with essential nutrients for a healthy and active life. Made with real chicken and vegetables.',
    imageUrl: '/placeholder.svg', // Using a placeholder image
    stock: 50,
  },
  {
    id: 'prod2',
    name: 'Interactive Cat Toy',
    category: 'Toys',
    price: 12.50,
    description: 'Engage your cat with this fun and interactive toy. Features a laser pointer and feather attachment.',
    imageUrl: '/placeholder.svg',
    stock: 120,
  },
  {
    id: 'prod3',
    name: 'Pet Grooming Brush',
    category: 'Grooming',
    price: 25.00,
    description: 'Gentle grooming brush for all types of pet fur. Helps reduce shedding and keeps coats shiny.',
    imageUrl: '/placeholder.svg',
    stock: 80,
  },
  {
    id: 'prod4',
    name: 'Comfort Pet Bed',
    category: 'Accessories',
    price: 75.00,
    discountPrice: 60.00,
    description: 'Luxurious and comfortable bed for your pet to relax. Soft, plush material for ultimate comfort.',
    imageUrl: '/placeholder.svg',
    stock: 30,
  },
  {
    id: 'prod5',
    name: 'Small Animal Cage',
    category: 'Habitats',
    price: 120.00,
    description: 'Spacious and secure cage for small animals like hamsters or guinea pigs. Easy to clean.',
    imageUrl: '/placeholder.svg',
    stock: 15,
  },
  {
    id: 'prod6',
    name: 'Fish Tank Starter Kit',
    category: 'Aquatics',
    price: 89.99,
    discountPrice: 79.99,
    description: 'Everything you need to start your first aquarium. Includes tank, filter, heater, and decorations.',
    imageUrl: '/placeholder.svg',
    stock: 20,
  },
];

export const addProduct = (newProduct: Omit<Product, 'id'>) => {
  const id = `prod${mockProducts.length + 1}`; // Simple ID generation
  const productWithId = { ...newProduct, id };
  mockProducts.push(productWithId);
  return productWithId;
};

export const updateProduct = (updatedProduct: Product) => {
  const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    mockProducts[index] = updatedProduct;
    return true;
  }
  return false;
};

export const deleteProduct = (productId: string) => {
  const initialLength = mockProducts.length;
  mockProducts = mockProducts.filter(p => p.id !== productId);
  return mockProducts.length < initialLength;
};