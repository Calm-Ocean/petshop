"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useCart, CartItem as CartItemType } from '@/context/CartContext'; // Import CartItemType from context

interface CartItemProps {
  item: CartItemType; // Use the CartItemType from context
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    // Only update if it's a valid number, otherwise let the input handle its own state
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const price = item.discount_price ?? item.price;
  const itemTotal = price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 last:border-b-0 gap-4">
      {/* Product Info: Image, Name, Category */}
      <div className="flex items-center gap-4 flex-grow">
        <Link to={`/shop/${item.id}`} className="flex-shrink-0">
          <img
            src={item.image_url || 'https://via.placeholder.com/80'}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-md"
          />
        </Link>
        <div className="flex flex-col min-w-0">
          <Link to={`/shop/${item.id}`} className="text-lg font-semibold hover:underline line-clamp-2">
            {item.name}
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-1">{item.category}</p>
        </div>
      </div>

      {/* Quantity, Price, Total, Remove Button */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <p className="text-primary font-medium sm:hidden">Price: ₹{price.toFixed(2)}</p> {/* Show price on small screens */}
        <Input
          type="number"
          min="1"
          max={item.stock}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 text-center"
          aria-label={`Quantity for ${item.name}`}
        />
        <p className="text-lg font-semibold min-w-[80px] text-right">₹{itemTotal.toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;