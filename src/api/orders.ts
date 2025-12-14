const API_BASE_URL = '/api/orders';

export type CreateOrderDTO = {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  paymentMethod: string;
  deliveryMethod: string;
};

export const ordersApi = {
  createOrder: async (data: CreateOrderDTO, token: string) => {
    // Get token from localStorage if not provided or valid
    const accessToken = token || localStorage.getItem('accessToken');

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }
    return response.json();
  },

  getMyOrders: async (token?: string) => {
    const accessToken = token || localStorage.getItem('accessToken');
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }
};
