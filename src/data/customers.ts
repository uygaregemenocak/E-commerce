export type CustomerStatus = 'Active' | 'Inactive';
export type MembershipLevel = 'Standard' | 'Silver' | 'Gold' | 'Platinum';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
  membershipLevel: MembershipLevel;
  status: CustomerStatus;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  address: string;
  notes: string[];
};

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    memberId: 'AMR-CUST-001',
    membershipLevel: 'Platinum',
    status: 'Active',
    registrationDate: 'Jan 15, 2024',
    totalOrders: 12,
    totalSpent: 28450,
    address: '123 Park Avenue, New York, NY 10001',
    notes: [
      'Preferred customer - provide priority shipping',
      'Prefers neutral colors',
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '+1 (555) 234-5678',
    memberId: 'AMR-CUST-002',
    membershipLevel: 'Gold',
    status: 'Active',
    registrationDate: 'Feb 03, 2024',
    totalOrders: 8,
    totalSpent: 19200,
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    notes: [
      'Interested in new suit collections',
    ],
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.w@email.com',
    phone: '+1 (555) 345-6789',
    memberId: 'AMR-CUST-003',
    membershipLevel: 'Platinum',
    status: 'Active',
    registrationDate: 'Mar 12, 2024',
    totalOrders: 15,
    totalSpent: 42300,
    address: '789 Pine Street, Chicago, IL 60601',
    notes: [
      'VIP customer - personal styling sessions',
      'Prefers evening wear',
    ],
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'james.b@email.com',
    phone: '+1 (555) 456-7890',
    memberId: 'AMR-CUST-004',
    membershipLevel: 'Silver',
    status: 'Inactive',
    registrationDate: 'Jan 28, 2024',
    totalOrders: 3,
    totalSpent: 8500,
    address: '321 Elm Drive, Houston, TX 77001',
    notes: [],
  },
  {
    id: '5',
    name: 'Olivia Davis',
    email: 'olivia.d@email.com',
    phone: '+1 (555) 567-8901',
    memberId: 'AMR-CUST-005',
    membershipLevel: 'Gold',
    status: 'Active',
    registrationDate: 'Apr 05, 2024',
    totalOrders: 10,
    totalSpent: 31800,
    address: '654 Maple Lane, Phoenix, AZ 85001',
    notes: [
      'Prefers dresses in jewel tones',
    ],
  },
  {
    id: '6',
    name: 'William Martinez',
    email: 'william.m@email.com',
    phone: '+1 (555) 678-9012',
    memberId: 'AMR-CUST-006',
    membershipLevel: 'Silver',
    status: 'Active',
    registrationDate: 'May 18, 2024',
    totalOrders: 6,
    totalSpent: 15900,
    address: '987 Cedar Boulevard, Philadelphia, PA 19101',
    notes: [],
  },
  {
    id: '7',
    name: 'Sophia Garcia',
    email: 'sophia.g@email.com',
    phone: '+1 (555) 789-0123',
    memberId: 'AMR-CUST-007',
    membershipLevel: 'Standard',
    status: 'Active',
    registrationDate: 'Jun 22, 2024',
    totalOrders: 2,
    totalSpent: 5600,
    address: '147 Birch Way, San Antonio, TX 78201',
    notes: [],
  },
  {
    id: '8',
    name: 'Alexander Lee',
    email: 'alex.l@email.com',
    phone: '+1 (555) 890-1234',
    memberId: 'AMR-CUST-008',
    membershipLevel: 'Gold',
    status: 'Active',
    registrationDate: 'Jul 10, 2024',
    totalOrders: 9,
    totalSpent: 24500,
    address: '258 Spruce Court, San Diego, CA 92101',
    notes: [
      'Corporate account - bulk orders',
    ],
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return customers.find(c => c.id === id);
}

export function getCustomersByStatus(status: CustomerStatus): Customer[] {
  return customers.filter(c => c.status === status);
}

export function searchCustomers(query: string): Customer[] {
  const lowerQuery = query.toLowerCase();
  return customers.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    c.phone.includes(query)
  );
}

