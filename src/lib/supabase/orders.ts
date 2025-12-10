import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/context/CartContext';
import { Order, ShippingAddress } from '@/types/order'; // Import Order and ShippingAddress from new type file

// Function to create a new order and its items
export const createOrder = async (
  userId: string,
  customerName: string,
  shippingAddress: ShippingAddress,
  cartItems: CartItem[],
  totalAmount: number,
  transactionId?: string
): Promise<Order> => {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_name: customerName,
      shipping_address: shippingAddress, // Stored as JSONB
      total_amount: totalAmount,
      status: 'pending',
      transaction_id: transactionId,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  const orderItemsToInsert = cartItems.map(item => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    product_price: item.discount_price !== undefined ? item.discount_price : item.price,
    quantity: item.quantity,
    image_url: item.image_url,
  }));

  const { error: orderItemsError } = await supabase
    .from('order_items')
    .insert(orderItemsToInsert);

  if (orderItemsError) {
    console.error('Error creating order items:', orderItemsError);
    // Consider rolling back the order if item creation fails
    throw orderItemsError;
  }

  // Return the created order in a format consistent with your Order type
  return {
    id: orderData.id,
    userId: orderData.user_id,
    customerName: orderData.customer_name,
    shippingAddress: orderData.shipping_address as ShippingAddress,
    items: cartItems, // For now, return original cart items, will fetch properly later
    totalAmount: orderData.total_amount,
    orderDate: orderData.order_date,
    status: orderData.status as Order['status'],
    transactionId: orderData.transaction_id,
  };
};

// Function to fetch orders for a specific user
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_id,
        product_name,
        product_price,
        quantity,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('order_date', { ascending: false });

  if (ordersError) {
    console.error('Error fetching user orders:', ordersError);
    throw ordersError;
  }

  return ordersData.map(order => ({
    id: order.id,
    userId: order.user_id,
    customerName: order.customer_name,
    shippingAddress: order.shipping_address as ShippingAddress,
    items: order.order_items.map((item: any) => ({
      id: item.product_id, // Map product_id to id for consistency with Product type
      name: item.product_name,
      price: item.product_price,
      quantity: item.quantity,
      image_url: item.image_url,
      // Add other Product properties if needed, or fetch full product details separately
      category: 'N/A', // Placeholder
      description: 'N/A', // Placeholder
      stock: 0, // Placeholder
    })),
    totalAmount: order.total_amount,
    orderDate: order.order_date,
    status: order.status as Order['status'],
    transactionId: order.transaction_id,
  }));
};

// Function to fetch all orders (for admin)
export const getAllOrders = async (): Promise<Order[]> => {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_id,
        product_name,
        product_price,
        quantity,
        image_url
      )
    `)
    .order('order_date', { ascending: false });

  if (ordersError) {
    console.error('Error fetching all orders:', ordersError);
    throw ordersError;
  }

  return ordersData.map(order => ({
    id: order.id,
    userId: order.user_id,
    customerName: order.customer_name,
    shippingAddress: order.shipping_address as ShippingAddress,
    items: order.order_items.map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      quantity: item.quantity,
      image_url: item.image_url,
      category: 'N/A',
      description: 'N/A',
      stock: 0,
    })),
    totalAmount: order.total_amount,
    orderDate: order.order_date,
    status: order.status as Order['status'],
    transactionId: order.transaction_id,
  }));
};

// Function to update an order's status (for admin)
export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};