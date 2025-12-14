import api, { ApiResponse } from './client';

export type CartItem = {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  stockQuantity: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export const cartApi = {
  async getCart(): Promise<Cart> {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data.data || { items: [], subtotal: 0, shipping: 0, total: 0 };
  },

  async addItem(variantId: string, quantity: number = 1): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>('/cart/items', { variantId, quantity });
    return response.data.data!;
  },

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });
    return response.data.data!;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data!;
  },

  async clearCart(): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>('/cart');
    return response.data.data!;
  },
};

