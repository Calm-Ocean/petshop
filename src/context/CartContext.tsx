"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

// Define the structure for a cart item, extending Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of the CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component to wrap the application and provide cart functionality
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart from localStorage or an empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        return [];
      }
    }
    return [];
  });

  // Effect to save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cartItems]);

  // Function to add a product to the cart
  const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.name} to cart.`);
          return prevItems; // Do not update if stock limit exceeded
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        toast.success(`${quantityToAdd}x ${product.name} added to cart.`);
        return updatedItems;
      } else {
        // If item is new, add it to the cart
        if (quantityToAdd > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.name} to cart.`);
          return prevItems; // Do not add if initial quantity exceeds stock
        }
        toast.success(`${quantityToAdd}x ${product.name} added to cart.`);
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  }, []);

  // Function to remove a product from the cart
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  // Function to update the quantity of a product in the cart
  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          if (newQuantity <= 0) {
            toast.info(`${item.name} removed from cart.`);
            return null; // Mark for removal
          }
          if (newQuantity > item.stock) {
            toast.error(`Cannot add more than ${item.stock} of ${item.name} to cart.`);
            return { ...item, quantity: item.stock }; // Cap quantity at max stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]; // Filter out nulls (removed items)
    });
  }, []);

  // Function to clear all items from the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared.");
  }, []);

  // Calculate total amount of items in the cart
  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price ?? item.price;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate total number of items (sum of quantities) in the cart
  const cartItemCount = React.useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};