import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';


const returns = [
  {
    id: 'RET-2024-089',
    orderId: 'ORD-1089',
    customer: 'Michael Chen',
    reason: 'Wrong size',
    condition: 'New',
    resolution: 'Refund',
    status: 'Pending',
    submittedDate: 'Nov 20, 2024',
  },
  {
    id: 'RET-2024-088',
    orderId: 'ORD-0987',
    customer: 'Emma Williams',
    reason: 'Changed mind',
    condition: 'New',
    resolution: 'Exchange',
    status: 'Approved',
    submittedDate: 'Nov 18, 2024',
  },
  {
    id: 'RET-2024-087',
    orderId: 'ORD-0876',
    customer: 'James Brown',
    reason: 'Defective item',
    condition: 'Damaged',
    resolution: 'Refund',
    status: 'Processing',
    submittedDate: 'Nov 15, 2024',
  },
  {
    id: 'RET-2024-086',
    orderId: 'ORD-0765',
    customer: 'Sarah Johnson',
    reason: 'Not as described',
    condition: 'Used',
    resolution: 'Store Credit',
    status: 'Completed',
    submittedDate: 'Nov 12, 2024',
  },
  {
    id: 'RET-2024-085',
    orderId: 'ORD-0654',
    customer: 'Olivia Davis',
    reason: 'Wrong item received',
    condition: 'New',
    resolution: 'Exchange',
    status: 'Approved',
    submittedDate: 'Nov 10, 2024',
  },
];

export function ReturnsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch = 
      ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ret.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      case 'Pending':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Used':
        return 'bg-amber-100 text-amber-800';
      case 'Damaged':
        return 'bg-red-100 text-red-800';
      case 'Lost':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <AdminLayout currentPage="admin-returns">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search by return #, order # or customer..."
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
                <SelectItem value="all">All Returns</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> System keeps history of customers with frequent damaged/lost returns. 
            Review customer profiles for return patterns before approving.
          </p>
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Return #</th>
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Order #</th>
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Reason</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Condition</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Resolution</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Status</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((ret) => (
                  <tr key={ret.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-900">{ret.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-700">{ret.orderId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-700">{ret.customer}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-700">{ret.reason}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getConditionColor(ret.condition)}`}>
                        {ret.condition}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm text-neutral-700">{ret.resolution}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(ret.status)}`}>
                        {ret.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {ret.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              title="Deny"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {ret.status !== 'Pending' && (
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>
            Showing {filteredReturns.length} of {returns.length} returns
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
