import { Product } from '@/types/product';

export let mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Premium Dog Food',
    category: 'Dog Food', // Updated category
    price: 45.99,
    discountPrice: 39.99,
    description: 'High-quality dog food with essential nutrients for a healthy and active life. Made with real chicken and vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 50,
  },
  {
    id: 'prod2',
    name: 'Interactive Cat Toy',
    category: 'Cat Toys', // Updated category
    price: 12.50,
    description: 'Engage your cat with this fun and interactive toy. Features a laser pointer and feather attachment.',
    imageUrl: 'https://images.unsplash.com/photo-1514888677646-088207775e03?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 120,
  },
  {
    id: 'prod3',
    name: 'Pet Grooming Brush',
    category: 'Grooming Supplies', // Updated category
    price: 25.00,
    description: 'Gentle grooming brush for all types of pet fur. Helps reduce shedding and keeps coats shiny.',
    imageUrl: 'https://images.unsplash.com/photo-1583511657547-f000070a032f?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 80,
  },
  {
    id: 'prod4',
    name: 'Comfort Pet Bed',
    category: 'Pet Beds', // Updated category
    price: 75.00,
    discountPrice: 60.00,
    description: 'Luxurious and comfortable bed for your pet to relax. Soft, plush material for ultimate comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8a8c3?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 30,
  },
  {
    id: 'prod5',
    name: 'Small Animal Cage',
    category: 'Accessories', // Updated category to fit existing categories
    price: 120.00,
    description: 'Spacious and secure cage for small animals like hamsters or guinea pigs. Easy to clean.',
    imageUrl: 'https://images.unsplash.com/photo-1596229800843-11620916049d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 15,
  },
  {
    id: 'prod6',
    name: 'Fish Tank Starter Kit',
    category: 'Aquatics',
    price: 89.99,
    discountPrice: 79.99,
    description: 'Everything you need to start your first aquarium. Includes tank, filter, heater, and decorations.',
    imageUrl: 'https://images.unsplash.com/photo-1522069169770-1d771879e933?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 20,
  },
  {
    id: 'prod7',
    name: 'Healthy Dog Treats',
    category: 'Snacks', // New product for Snacks
    price: 15.00,
    description: 'Delicious and healthy treats for your dog, perfect for training or rewards.',
    imageUrl: 'https://images.unsplash.com/photo-1591162022477-f7797a77014a?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 100,
  },
  {
    id: 'prod8',
    name: 'Durable Chew Toy',
    category: 'Toys', // New product for general Toys
    price: 18.75,
    description: 'A tough and durable chew toy designed for strong chewers, promoting dental health.',
    imageUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469e0453?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 70,
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