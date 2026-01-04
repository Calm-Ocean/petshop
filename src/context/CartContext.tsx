"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cartItems');
        console.log('CartContext: Initializing from localStorage. Saved cart:', savedCart);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error('CartContext: Error parsing localStorage cart during initialization:', e);
        return [];
      }
    }
    console.log('CartContext: Initializing with empty cart (window undefined).');
    return [];
  });

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      try {
        console.log('CartContext: Saving cart to localStorage. Current cart:', cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (e) {
        console.error('CartContext: Error saving cart to localStorage:', e);
      }
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    console.log('CartContext: Attempting to add product to cart:', product);
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.name} to cart.`);
          return prevItems;
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        toast.success(`${quantityToAdd}x ${product.name} added to cart.`);
        console.log('CartContext: Updated existing item in cart:', updatedItems[existingItemIndex]);
        return updatedItems;
      } else {
        if (quantityToAdd > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.name} to cart.`);
          return prevItems;
        }
        toast.success(`${quantityToAdd}x ${product.name} added to cart.`);
        const newItem = { ...product, quantity: quantityToAdd };
        console.log('CartContext: Added new item to cart:', newItem);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId) {
          if (newQuantity <= 0) {
            toast.info(`${item.name} removed from cart.`);
            return null; // Mark for removal
          }
          if (newQuantity > item.stock) {
            toast.error(`Cannot add more than ${item.stock} of ${item.name} to cart.`);
            return { ...item, quantity: item.stock }; // Cap at max stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]; // Filter out nulls (removed items)
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared.");
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.discount_price ?? item.price; // Simplified using nullish coalescing
    console.log(`CartContext: Calculating total for item ${item.name}: price=${price}, quantity=${item.quantity}, subtotal=${price * item.quantity}`);
    return total + price * item.quantity;
  }, 0);
  console.log('CartContext: Current cart total:', cartTotal);


  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};