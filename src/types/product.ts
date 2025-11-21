export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  description: string;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface OrderItem {
  product_id: string | null; // Can be null if product is deleted
  product_name: string;
  product_price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[]; // This will be stored as JSONB in Supabase
  total_amount: number;
  order_date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transaction_id?: string;
}