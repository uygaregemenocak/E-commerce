export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
};

export const orders: Order[] = [
  {
    id: 'ORD-2024-1248',
    customerId: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    date: 'Nov 21, 2024',
    status: 'Processing',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-1',
        productId: '1',
        name: 'Midnight Silk Gown',
        image: 'https://images.unsplash.com/flagged/photo-1564181595228-a5c75430cdac?w=200',
        price: 2850,
        size: 'M',
        color: 'Midnight Blue',
        quantity: 1,
      },
    ],
    subtotal: 2850,
    shipping: 0,
    tax: 0,
    total: 2850,
    shippingAddress: '123 Main Street, New York, NY 10001',
  },
  {
    id: 'ORD-2024-1247',
    customerId: '2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.c@email.com',
    date: 'Nov 21, 2024',
    status: 'Processing',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-2',
        productId: '2',
        name: 'Classic Charcoal Suit',
        image: 'https://images.unsplash.com/photo-1718351041906-d1086f502f8a?w=200',
        price: 3200,
        size: 'L',
        color: 'Charcoal',
        quantity: 1,
      },
    ],
    subtotal: 3200,
    shipping: 0,
    tax: 0,
    total: 3200,
    shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
  },
  {
    id: 'ORD-2024-1246',
    customerId: '3',
    customerName: 'Emma Williams',
    customerEmail: 'emma.w@email.com',
    date: 'Nov 20, 2024',
    status: 'Shipped',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-3',
        productId: '3',
        name: 'Cashmere Overcoat',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200',
        price: 4100,
        size: 'M',
        color: 'Camel',
        quantity: 1,
      },
    ],
    subtotal: 4100,
    shipping: 0,
    tax: 0,
    total: 4100,
    shippingAddress: '789 Pine Street, Chicago, IL 60601',
    trackingNumber: 'TRK-8934756246',
  },
  {
    id: 'ORD-2024-1245',
    customerId: '4',
    customerName: 'James Brown',
    customerEmail: 'james.b@email.com',
    date: 'Nov 20, 2024',
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-4',
        productId: '11',
        name: 'Wool Peacoat',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200',
        price: 1850,
        size: 'L',
        color: 'Navy',
        quantity: 1,
      },
    ],
    subtotal: 1850,
    shipping: 0,
    tax: 0,
    total: 1850,
    shippingAddress: '321 Elm Drive, Houston, TX 77001',
    trackingNumber: 'TRK-8934756245',
  },
  {
    id: 'ORD-2024-1244',
    customerId: '5',
    customerName: 'Olivia Davis',
    customerEmail: 'olivia.d@email.com',
    date: 'Nov 20, 2024',
    status: 'Shipped',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-5',
        productId: '10',
        name: 'Burgundy Silk Dress',
        image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=200',
        price: 2400,
        size: 'S',
        color: 'Burgundy',
        quantity: 1,
      },
    ],
    subtotal: 2400,
    shipping: 0,
    tax: 0,
    total: 2400,
    shippingAddress: '654 Maple Lane, Phoenix, AZ 85001',
    trackingNumber: 'TRK-8934756244',
  },
  {
    id: 'ORD-2024-1243',
    customerId: '6',
    customerName: 'William Martinez',
    customerEmail: 'william.m@email.com',
    date: 'Nov 19, 2024',
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-6',
        productId: '4',
        name: 'Pearl Evening Dress',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200',
        price: 3600,
        size: 'M',
        color: 'Pearl',
        quantity: 1,
      },
    ],
    subtotal: 3600,
    shipping: 0,
    tax: 0,
    total: 3600,
    shippingAddress: '987 Cedar Boulevard, Philadelphia, PA 19101',
    trackingNumber: 'TRK-8934756243',
  },
  {
    id: 'ORD-2024-1242',
    customerId: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    date: 'Nov 19, 2024',
    status: 'Pending',
    paymentStatus: 'Pending',
    items: [
      {
        id: 'item-7',
        productId: '5',
        name: 'Navy Pinstripe Suit',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200',
        price: 2900,
        size: 'M',
        color: 'Navy',
        quantity: 1,
      },
    ],
    subtotal: 2900,
    shipping: 0,
    tax: 0,
    total: 2900,
    shippingAddress: '123 Main Street, New York, NY 10001',
  },
  {
    id: 'ORD-2024-1241',
    customerId: '2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.c@email.com',
    date: 'Nov 18, 2024',
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-8',
        productId: '7',
        name: 'Emerald Velvet Gown',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200',
        price: 4200,
        size: 'S',
        color: 'Emerald',
        quantity: 1,
      },
    ],
    subtotal: 4200,
    shipping: 0,
    tax: 0,
    total: 4200,
    shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
    trackingNumber: 'TRK-8934756241',
  },
];

export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter(o => o.customerId === customerId);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter(o => o.status === status);
}

