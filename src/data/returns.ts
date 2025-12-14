export type ReturnStatus = 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
export type ReturnCondition = 'New' | 'Used' | 'Damaged' | 'Lost';
export type ReturnResolution = 'Refund' | 'Exchange' | 'Store Credit';

export type ReturnRequest = {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  reason: string;
  condition: ReturnCondition;
  resolution: ReturnResolution;
  status: ReturnStatus;
  submittedDate: string;
  resolvedDate?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
  }[];
};

export const returns: ReturnRequest[] = [
  {
    id: 'RET-2024-089',
    orderId: 'ORD-2024-1089',
    customerId: '2',
    customerName: 'Michael Chen',
    reason: 'Wrong size',
    condition: 'New',
    resolution: 'Refund',
    status: 'Pending',
    submittedDate: 'Nov 20, 2024',
    items: [
      { productId: '2', name: 'Classic Charcoal Suit', quantity: 1 },
    ],
  },
  {
    id: 'RET-2024-088',
    orderId: 'ORD-2024-0987',
    customerId: '3',
    customerName: 'Emma Williams',
    reason: 'Changed mind',
    condition: 'New',
    resolution: 'Exchange',
    status: 'Approved',
    submittedDate: 'Nov 18, 2024',
    items: [
      { productId: '7', name: 'Emerald Velvet Gown', quantity: 1 },
    ],
  },
  {
    id: 'RET-2024-087',
    orderId: 'ORD-2024-0876',
    customerId: '4',
    customerName: 'James Brown',
    reason: 'Defective item',
    condition: 'Damaged',
    resolution: 'Refund',
    status: 'Processing',
    submittedDate: 'Nov 15, 2024',
    items: [
      { productId: '8', name: 'Leather Trench Coat', quantity: 1 },
    ],
  },
  {
    id: 'RET-2024-086',
    orderId: 'ORD-2024-0765',
    customerId: '1',
    customerName: 'Sarah Johnson',
    reason: 'Not as described',
    condition: 'Used',
    resolution: 'Store Credit',
    status: 'Completed',
    submittedDate: 'Nov 12, 2024',
    resolvedDate: 'Nov 14, 2024',
    items: [
      { productId: '4', name: 'Pearl Evening Dress', quantity: 1 },
    ],
  },
  {
    id: 'RET-2024-085',
    orderId: 'ORD-2024-0654',
    customerId: '5',
    customerName: 'Olivia Davis',
    reason: 'Wrong item received',
    condition: 'New',
    resolution: 'Exchange',
    status: 'Approved',
    submittedDate: 'Nov 10, 2024',
    items: [
      { productId: '10', name: 'Burgundy Silk Dress', quantity: 1 },
    ],
  },
];

export function getReturnById(id: string): ReturnRequest | undefined {
  return returns.find(r => r.id === id);
}

export function getReturnsByStatus(status: ReturnStatus): ReturnRequest[] {
  return returns.filter(r => r.status === status);
}

export function getReturnsByCustomerId(customerId: string): ReturnRequest[] {
  return returns.filter(r => r.customerId === customerId);
}

