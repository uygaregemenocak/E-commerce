import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Search, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';


const orders = [
  { id: 'ORD-1248', customer: 'Sarah Johnson', date: 'Nov 21, 2024', payment: 'Paid', fulfillment: 'Processing', total: 2850 },
  { id: 'ORD-1247', customer: 'Michael Chen', date: 'Nov 21, 2024', payment: 'Paid', fulfillment: 'Processing', total: 3200 },
  { id: 'ORD-1246', customer: 'Emma Williams', date: 'Nov 20, 2024', payment: 'Paid', fulfillment: 'Shipped', total: 4100 },
  { id: 'ORD-1245', customer: 'James Brown', date: 'Nov 20, 2024', payment: 'Paid', fulfillment: 'Delivered', total: 1850 },
  { id: 'ORD-1244', customer: 'Olivia Davis', date: 'Nov 20, 2024', payment: 'Paid', fulfillment: 'Shipped', total: 2400 },
  { id: 'ORD-1243', customer: 'William Martinez', date: 'Nov 19, 2024', payment: 'Paid', fulfillment: 'Delivered', total: 3600 },
  { id: 'ORD-1242', customer: 'Sophia Garcia', date: 'Nov 19, 2024', payment: 'Pending', fulfillment: 'Pending', total: 2900 },
  { id: 'ORD-1241', customer: 'Alexander Lee', date: 'Nov 18, 2024', payment: 'Paid', fulfillment: 'Delivered', total: 4200 },
];

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.fulfillment.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusColor = (status: string) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  return (
    <AdminLayout currentPage="admin-orders">
      <div className="space-y-6">
        {!selectedOrder ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    placeholder="Search by order # or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Pending', value: orders.filter(o => o.fulfillment === 'Pending').length, icon: Package },
                { label: 'Processing', value: orders.filter(o => o.fulfillment === 'Processing').length, icon: Package },
                { label: 'Shipped', value: orders.filter(o => o.fulfillment === 'Shipped').length, icon: Truck },
                { label: 'Delivered', value: orders.filter(o => o.fulfillment === 'Delivered').length, icon: CheckCircle },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-neutral-400" />
                      <span className="text-2xl text-neutral-900">{stat.value}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="text-left py-4 px-6 text-sm text-neutral-600">Order #</th>
                      <th className="text-left py-4 px-6 text-sm text-neutral-600">Customer</th>
                      <th className="text-left py-4 px-6 text-sm text-neutral-600">Date</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">Payment</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">Fulfillment</th>
                      <th className="text-right py-4 px-6 text-sm text-neutral-600">Total</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-900">{order.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700">{order.customer}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700">{order.date}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getPaymentStatusColor(order.payment)}`}>
                            {order.payment}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getFulfillmentStatusColor(order.fulfillment)}`}>
                            {order.fulfillment}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm text-neutral-900">${order.total.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Order Detail View */
          <div className="bg-white rounded-lg p-8 border border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl text-neutral-900">Order Details - {selectedOrder}</h2>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Back to Orders
              </Button>
            </div>

            {selectedOrderData && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Customer</p>
                    <p className="text-neutral-900">{selectedOrderData.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Order Date</p>
                    <p className="text-neutral-900">{selectedOrderData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Total</p>
                    <p className="text-2xl text-neutral-900">${selectedOrderData.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg text-neutral-900 mb-4">Order Actions</h3>
                  <div className="flex gap-3">
                    {selectedOrderData.fulfillment === 'Processing' && (
                      <Button className="bg-black hover:bg-neutral-800">
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedOrderData.fulfillment === 'Shipped' && (
                      <Button className="bg-black hover:bg-neutral-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                    <Button variant="outline">Initiate Refund</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
