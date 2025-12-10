export interface Product {
  id: string; // Corresponds to 'asin' from your CSV
  name: string;
  category: string;
  price: number; // Stored in readable currency units (e.g., INR)
  discount_price?: number | null; // Stored in readable currency units, optional
  description: string;
  image_url?: string | null; // Changed to image_url to match Supabase
  stock: number;
  url?: string | null;
  asin?: string | null; // Keeping asin as a separate field if needed, though it's the ID
  currency?: string | null;
  brand?: string | null;
  overview?: any | null; // JSONB type
  about_item?: string | null;
  availability?: string | null;
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