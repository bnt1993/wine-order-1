
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  benefits: string[];
  badges?: string[];
  origin?: string;
  volume?: string;
  alcoholContent?: string;
  agingTime?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export enum Category {
  DượcLiệuQuý = 'Dược Liệu Quý',
  SâmVàNấm = 'Sâm & Nấm',
  TráiCâyRừng = 'Trái Cây Rừng',
  HỗTrợSứcKhỏe = 'Hỗ Trợ Sức Khỏe'
}
