export interface Product {
  id: string; // Unique identifier for the product (UUID)
  name: string;
  category: string;
  price: number; // Stored in readable currency units (e.g., INR)
  discount_price?: number | null; // Stored in readable currency units, optional
  description: string;
  image_url?: string | null; // Changed to image_url to match Supabase
  stock: number; // New field for product stock
  url?: string | null;
  asin?: string | null; // Keeping asin as a separate field if needed
  currency?: string | null;
  brand?: string | null;
  overview?: any | null; // JSONB type
  about_item?: string | null;
  specifications?: any | null; // JSONB type
  uniq_id?: string | null;
  scraped_at?: string | null;
  created_at?: string | null;
}

export interface Category {
  name: string;
  imageUrl: string; // We'll need to decide how to get this, for now, a placeholder or derived
  description: string; // Derived or placeholder
}