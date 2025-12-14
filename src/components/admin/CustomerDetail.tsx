import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { ArrowLeft, Mail, Phone, MapPin, CreditCard, Package } from 'lucide-react';
import { Button } from '../ui/button';

const customerData = {
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+1 (555) 123-4567',
  memberId: 'AMR-CUST-001',
  membershipLevel: 'Platinum',
  joinDate: 'Jan 15, 2024',
  totalOrders: 12,
  totalSpent: 28450,
  address: '123 Park Avenue, New York, NY 10001',
  recentOrders: [
    { id: 'ORD-1156', date: 'Nov 18, 2024', total: 6050, status: 'Delivered' },
    { id: 'ORD-1089', date: 'Nov 10, 2024', total: 4100, status: 'Shipped' },
    { id: 'ORD-0987', date: 'Oct 28, 2024', total: 2400, status: 'Delivered' },
  ],
  notes: [
    'Preferred customer - provide priority shipping',
    'Prefers neutral colors',
  ],
};

type CustomerDetailProps = {
  customerId?: string;
};

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const navigate = useNavigate();
  
  // In a real app, we would fetch customer data based on customerId
  console.log('Viewing customer:', customerId);

  const onNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'admin-customers': '/admin/customers',
    };
    navigate(routeMap[page] || '/admin');
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'Platinum':
        return 'from-neutral-700 to-neutral-900';
      case 'Gold':
        return 'from-amber-500 to-amber-700';
      case 'Silver':
        return 'from-neutral-400 to-neutral-600';
      default:
        return 'from-neutral-300 to-neutral-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <AdminLayout currentPage="admin-customer-detail">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => onNavigate('admin-customers')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>

        <div className="grid grid-cols-3 gap-6">
          {/* Loyalty Card */}
          <div className="col-span-1">
            <div className={`bg-gradient-to-br ${getMembershipColor(customerData.membershipLevel)} rounded-2xl p-8 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="font-serif italic text-xl">A</span>
                </div>
                <span className="font-serif text-xl">Amor</span>
              </div>

              <div className="mb-6">
                <p className="text-white/70 text-sm mb-1">Member Name</p>
                <p className="text-2xl">{customerData.name}</p>
              </div>

              <div className="mb-6">
                <p className="text-white/70 text-sm mb-1">Member ID</p>
                <p className="text-lg font-mono">{customerData.memberId}</p>
              </div>

              <div className="mb-8">
                <p className="text-white/70 text-sm mb-1">Membership Level</p>
                <p className="text-xl">{customerData.membershipLevel}</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
                <div className="text-neutral-900 text-xs text-center">QR Code</div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <h3 className="text-lg text-neutral-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 text-sm mb-4">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-neutral-600">Email</p>
                      <p className="text-neutral-900">{customerData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-4">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-neutral-600">Phone</p>
                      <p className="text-neutral-900">{customerData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-neutral-600">Default Address</p>
                      <p className="text-neutral-900">{customerData.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-600 mb-1">Member Since</p>
                    <p className="text-neutral-900">{customerData.joinDate}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
                    <p className="text-2xl text-neutral-900">{customerData.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Total Spent</p>
                    <p className="text-2xl text-neutral-900">${customerData.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-lg text-neutral-900">Recent Orders</h3>
                <Package className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="text-left py-3 px-6 text-sm text-neutral-600">Order #</th>
                      <th className="text-left py-3 px-6 text-sm text-neutral-600">Date</th>
                      <th className="text-right py-3 px-6 text-sm text-neutral-600">Total</th>
                      <th className="text-left py-3 px-6 text-sm text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-100">
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-900">{order.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700">{order.date}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm text-neutral-900">${order.total.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Support Notes */}
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <h3 className="text-lg text-neutral-900 mb-4">Support Notes</h3>
              <div className="space-y-2">
                {customerData.notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                    <p className="text-sm text-neutral-700 flex-1">{note}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
