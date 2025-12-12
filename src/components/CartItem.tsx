"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: Product & { quantity: number };
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const price = item.discount_price ?? item.price; // Fixed: Use nullish coalescing to handle null discount_price
  const itemTotal = price * item.quantity;

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-b-0">
      <div className="flex items-center space-x-4">
        <Link to={`/shop/${item.id}`}>
          <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
        </Link>
        <div>
          <Link to={`/shop/${item.id}`} className="text-lg font-semibold hover:underline">
            {item.name}
          </Link>
          <p className="text-muted-foreground text-sm">{item.category}</p>
          <p className="text-primary font-medium">₹{price.toFixed(0)} each</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Input
          type="number"
          min="1"
          max={item.stock}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 text-center"
        />
        <p className="text-lg font-semibold">₹{itemTotal.toFixed(0)}</p>
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;