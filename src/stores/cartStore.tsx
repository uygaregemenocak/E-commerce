import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string; // cart item id
  variantId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stockQuantity: number;
};

type CartData = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  items: [],
  loading: false,
  error: null,
  addItem: async () => { },
  updateQuantity: async () => { },
  removeItem: async () => { },
  clearCart: async () => { },
  getCartTotal: () => 0,
  getCartCount: () => 0,
  getSubtotal: () => 0,
  getShipping: () => 0,
  fetchCart: async () => { },
});

const SESSION_STORAGE_KEY = 'amor_session_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartData>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch cart when sessionId is available
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-session-id': sessionId,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchCart = async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      if (data.success) {
        setCartData(data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (variantId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ variantId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item');
      }

      const data = await response.json();
      if (data.success) {
        setCartData(data.data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(err.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const data = await response.json();
      if (data.success) {
        setCartData(data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const data = await response.json();
      if (data.success) {
        setCartData(data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      const data = await response.json();
      if (data.success) {
        setCartData(data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = () => cartData.subtotal;
  const getShipping = () => cartData.shipping;
  const getCartTotal = () => cartData.total;
  const getCartCount = () => cartData.items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items: cartData.items,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartCount,
    getSubtotal,
    getShipping,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
