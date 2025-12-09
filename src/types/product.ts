export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  imageUrl: string;
  stock: number;
}