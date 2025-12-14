import api, { ApiResponse } from './client';

export type OrderItem = {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  payment?: {
    method: string;
    status: string;
    transactionId?: string;
  };
  shipment?: {
    carrier?: string;
    trackingNumber?: string;
    status: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
};

export type CreateOrderData = {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  paymentMethod?: string;
  deliveryMethod?: string;
};

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data || [];
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data!;
  },

  async updateStatus(id: string, status: string, trackingNumber?: string): Promise<void> {
    await api.patch(`/orders/${id}/status`, { status, trackingNumber });
  },
};

