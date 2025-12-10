import { Product } from './product'; // Assuming Product type is defined here

export interface OrderItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string; // ISO date string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: string;
}