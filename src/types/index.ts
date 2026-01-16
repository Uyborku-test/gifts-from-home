export interface Category {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  file_path: string;
  is_main: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category?: Category;
  images?: ProductImage[];
  is_active: boolean;
  telegram_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  phone: string;
  address: string;
  comment?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  success: boolean;
  message: string;
}
