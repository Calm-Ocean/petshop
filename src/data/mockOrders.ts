import { Product } from '@/types/product';

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; // In a real app, this would link to a user
  customerName: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderDate: string; // ISO date string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: string; // New field for transaction ID
}

export let mockOrders: Order[] = [
  {
    id: 'order1',
    userId: 'user1',
    customerName: 'Regular User',
    shippingAddress: {
      fullName: 'Regular User',
      address: '123 Main St',
      city: 'Anytown',
      zipCode: '12345',
      country: 'USA',
    },
    items: [
      {
        id: 'prod1',
        name: 'Premium Dog Food',
        category: 'Food',
        price: 45.99,
        discountPrice: 39.99,
        description: 'High-quality dog food with essential nutrients for a healthy and active life. Made with real chicken and vegetables.',
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 50,
        quantity: 1,
      },
      {
        id: 'prod2',
        name: 'Interactive Cat Toy',
        category: 'Toys',
        price: 12.50,
        description: 'Engage your cat with this fun and interactive toy. Features a laser pointer and feather attachment.',
        imageUrl: 'https://images.unsplash.com/photo-1514888677646-088207775e03?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 120,
        quantity: 2,
      },
    ],
    totalAmount: 39.99 * 1 + 12.50 * 2,
    orderDate: '2023-10-26T10:00:00Z',
    status: 'delivered',
  },
  {
    id: 'order2',
    userId: 'admin1',
    customerName: 'Admin User',
    shippingAddress: {
      fullName: 'Admin User',
      address: '456 Oak Ave',
      city: 'Otherville',
      zipCode: '67890',
      country: 'USA',
    },
    items: [
      {
        id: 'prod4',
        name: 'Comfort Pet Bed',
        category: 'Accessories',
        price: 75.00,
        discountPrice: 60.00,
        description: 'Luxurious and comfortable bed for your pet to relax. Soft, plush material for ultimate comfort.',
        imageUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8a8c3?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 30,
        quantity: 1,
      },
    ],
    totalAmount: 60.00 * 1,
    orderDate: '2023-11-15T14:30:00Z',
    status: 'processing',
  },
];

export const addOrder = (newOrder: Omit<Order, 'id' | 'orderDate'> & { transactionId?: string }) => {
  const id = `order${mockOrders.length + 1}`; // Simple ID generation
  const orderDate = new Date().toISOString();
  const orderWithIdAndDate = { ...newOrder, id, orderDate };
  mockOrders.push(orderWithIdAndDate);
  return orderWithIdAndDate;
};

export const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = newStatus;
    return true;
  }
  return false;
};