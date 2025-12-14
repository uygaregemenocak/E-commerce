import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Search, TrendingUp, Users, Package, Download, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';


const productResults = [
  { id: '1', name: 'Midnight Silk Gown', sku: 'AMR-DRS-001', category: 'Evening Dresses', price: 2850, stock: 8 },
  { id: '2', name: 'Classic Charcoal Suit', sku: 'AMR-SUT-002', category: 'Tailored Suits', price: 3200, stock: 12 },
];

const customerResults = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', totalSpent: 28450, orders: 12 },
  { id: '2', name: 'Michael Chen', email: 'michael.c@email.com', totalSpent: 19200, orders: 8 },
];

const orderResults = [
  { id: 'ORD-1248', customer: 'Sarah Johnson', date: 'Nov 21, 2024', total: 2850, status: 'Processing' },
  { id: 'ORD-1247', customer: 'Michael Chen', date: 'Nov 21, 2024', total: 3200, status: 'Paid' },
];

const reports = [
  {
    title: 'Sales Report',
    description: 'Detailed breakdown of sales by product, category, and time period',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800',
  },
  {
    title: 'Inventory Report',
    description: 'Stock levels, low stock alerts, and inventory valuation',
    icon: Package,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    title: 'Customer Report',
    description: 'Customer acquisition, retention, and lifetime value analysis',
    icon: Users,
    color: 'bg-purple-100 text-purple-800',
  },
];

export function SearchReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTab, setSearchTab] = useState('products');
  const [dateRange, setDateRange] = useState('last-30-days');

  return (
    <AdminLayout currentPage="admin-search">
      <div className="space-y-8">
        {/* Global Search Section */}
        <div className="bg-white rounded-lg p-8 border border-neutral-200">
          <h2 className="text-2xl text-neutral-900 mb-6">Global Search</h2>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search products, customers, or orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={searchTab} onValueChange={setSearchTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="dresses">Evening Dresses</SelectItem>
                    <SelectItem value="suits">Tailored Suits</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                    <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                    <SelectItem value="3000+">$3,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Product</th>
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">SKU</th>
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Category</th>
                      <th className="text-right py-3 px-4 text-sm text-neutral-600">Price</th>
                      <th className="text-center py-3 px-4 text-sm text-neutral-600">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productResults.map((product) => (
                      <tr key={product.id} className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-sm text-neutral-900">{product.name}</td>
                        <td className="py-3 px-4 text-sm text-neutral-700 font-mono">{product.sku}</td>
                        <td className="py-3 px-4 text-sm text-neutral-700">{product.category}</td>
                        <td className="py-3 px-4 text-sm text-neutral-900 text-right">${product.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-neutral-900 text-center">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Total Spent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Spending</SelectItem>
                    <SelectItem value="0-5000">$0 - $5,000</SelectItem>
                    <SelectItem value="5000-20000">$5,000 - $20,000</SelectItem>
                    <SelectItem value="20000+">$20,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Registration Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last-30">Last 30 Days</SelectItem>
                    <SelectItem value="last-90">Last 90 Days</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Email</th>
                      <th className="text-center py-3 px-4 text-sm text-neutral-600">Orders</th>
                      <th className="text-right py-3 px-4 text-sm text-neutral-600">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerResults.map((customer) => (
                      <tr key={customer.id} className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-sm text-neutral-900">{customer.name}</td>
                        <td className="py-3 px-4 text-sm text-neutral-700">{customer.email}</td>
                        <td className="py-3 px-4 text-sm text-neutral-900 text-center">{customer.orders}</td>
                        <td className="py-3 px-4 text-sm text-neutral-900 text-right">${customer.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last-7">Last 7 Days</SelectItem>
                    <SelectItem value="last-30">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Order #</th>
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm text-neutral-600">Date</th>
                      <th className="text-center py-3 px-4 text-sm text-neutral-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm text-neutral-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderResults.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-sm text-neutral-900">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-neutral-700">{order.customer}</td>
                        <td className="py-3 px-4 text-sm text-neutral-700">{order.date}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-900 text-right">${order.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reports Section */}
        <div>
          <h2 className="text-2xl text-neutral-900 mb-6">Generate Reports</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            {reports.map((report, index) => {
              const Icon = report.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                  <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg text-neutral-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{report.description}</p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <h3 className="text-lg text-neutral-900 mb-4">Report Parameters</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-black hover:bg-neutral-800">
                <Calendar className="w-4 h-4 mr-2" />
                Select Custom Range
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
