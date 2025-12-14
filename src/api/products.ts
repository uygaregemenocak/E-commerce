import api, { ApiResponse } from './client';

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  stockQuantity: number;
  priceAdjustment: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  brand: string;
  description: string;
  fabric?: string;
  care?: string;
  basePrice: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  relatedProducts?: Product[];
};

export type ProductListResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const productsApi = {
  async getAll(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<ProductListResponse> {
    const response = await api.get<ApiResponse<Product[]>>('/products', { params });
    return {
      data: response.data.data || [],
      meta: response.data.meta || { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  async create(data: Partial<Product>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data!;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};

