import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  short_description: string;
  long_description: string;
  price: string;
  stock: number;
  cover_image: string;
  main_image_url: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  address_details?: string;
  reference_notes?: string;
  order_notes?: string;
}

export interface OrderItem {
  title: string;
  price: string;
  quantity: number;
}

export interface Order {
  order_id: string;
  status: string;
  total_amount: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
}

export const booksApi = {
  getAll: () => api.get<Book[]>('/books/all/'),
  getFeatured: () => api.get<Book[]>('/books/featured/'),
  getBySlug: (slug: string) => api.get<Book>(`/books/${slug}/`),
};

export const ordersApi = {
  create: (data: { items: OrderItem[]; shipping_address: ShippingAddress }) => 
    api.post<Order>('/orders/', data),
  getStatus: (orderId: string) => api.get<Order>(`/orders/status/${orderId}/`),
};

export const paymentsApi = {
  createPreference: (orderId: string) => 
    api.post<{ preference_id: string; init_point: string }>('/payments/create-preference/', { order_id: orderId }),
};

export default api;
