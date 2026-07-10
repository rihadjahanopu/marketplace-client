export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  location: string;
  rating: number;
  reviewCount: number;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'sold' | 'draft';
  date: string;
  specifications: { key: string; value: string }[];
  createdBy: User | string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ItemFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  date: string;
  priority: 'low' | 'medium' | 'high';
  location: string;
  images: string[];
  specifications: { key: string; value: string }[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
