import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Search, Eye, UserX, UserCheck, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const API_BASE_URL = '/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  memberId: string | null;
  membershipLevel: string | null;
}

export function CustomerManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const response = await fetch(`${API_BASE_URL}/customers?${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      if (data.success) {
        const formatted = data.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || 'N/A',
          status: c.isActive ? 'Active' : 'Inactive',
          registrationDate: new Date(c.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          totalOrders: c.totalOrders || 0,
          totalSpent: c.totalSpent || 0,
          memberId: c.memberId,
          membershipLevel: c.membershipLevel,
        }));
        setCustomers(formatted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const viewCustomer = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <AdminLayout currentPage="admin-customers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchCustomers} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Loading customers from database...</p>
          </div>
        ) : (
          <>
            {/* Customers Table */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-neutral-900">Customer</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-neutral-900">Contact</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-neutral-900">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-neutral-900">Member ID</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-neutral-900">Registration</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-neutral-900">Orders</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-neutral-900">Total Spent</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-neutral-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{customer.name}</p>
                            <p className="text-xs text-neutral-500">{customer.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-600">{customer.phone}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-600">
                          {customer.memberId || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-600">{customer.registrationDate}</td>
                        <td className="py-4 px-6 text-sm text-neutral-900 text-right">{customer.totalOrders}</td>
                        <td className="py-4 px-6 text-sm text-neutral-900 text-right">
                          ${customer.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewCustomer(customer.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-sm text-neutral-500 text-center">
              Showing {filteredCustomers.length} of {customers.length} customers • Data from PostgreSQL database
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
