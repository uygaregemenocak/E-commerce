import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { TrendingUp, Users, Package, DollarSign, Eye } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const kpiData = [
  { label: 'Total Orders', value: '1,248', change: '+12.5%', icon: Package, trend: 'up' },
  { label: 'Monthly Revenue', value: '$284,500', change: '+8.2%', icon: DollarSign, trend: 'up' },
  { label: 'Active Customers', value: '3,892', change: '+15.3%', icon: Users, trend: 'up' },
  { label: 'Products in Stock', value: '456', change: '-3.1%', icon: Package, trend: 'down' },
];

const ordersData = [
  { date: 'Mon', orders: 45 },
  { date: 'Tue', orders: 52 },
  { date: 'Wed', orders: 49 },
  { date: 'Thu', orders: 63 },
  { date: 'Fri', orders: 71 },
  { date: 'Sat', orders: 88 },
  { date: 'Sun', orders: 76 },
];

const productsData = [
  { name: 'Silk Gown', sales: 145 },
  { name: 'Charcoal Suit', sales: 132 },
  { name: 'Overcoat', sales: 98 },
  { name: 'Evening Dress', sales: 87 },
  { name: 'Trench Coat', sales: 76 },
];

const categoryData = [
  { name: 'Dresses', value: 35, color: '#000000' },
  { name: 'Suits', value: 30, color: '#404040' },
  { name: 'Outerwear', value: 20, color: '#808080' },
  { name: 'Accessories', value: 15, color: '#D4AF37' },
];

const recentOrders = [
  { id: 'ORD-1248', customer: 'Sarah Johnson', date: 'Nov 21, 2024', total: 2850, status: 'Processing' },
  { id: 'ORD-1247', customer: 'Michael Chen', date: 'Nov 21, 2024', total: 3200, status: 'Paid' },
  { id: 'ORD-1246', customer: 'Emma Williams', date: 'Nov 20, 2024', total: 4100, status: 'Shipped' },
  { id: 'ORD-1245', customer: 'James Brown', date: 'Nov 20, 2024', total: 1850, status: 'Delivered' },
  { id: 'ORD-1244', customer: 'Olivia Davis', date: 'Nov 20, 2024', total: 2400, status: 'Paid' },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'admin-orders': '/admin/orders',
    };
    navigate(routeMap[page] || '/admin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Paid':
        return 'bg-purple-100 text-purple-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <AdminLayout currentPage="admin-dashboard">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-neutral-700" />
                  </div>
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl text-neutral-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-neutral-600">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Orders Chart */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <h3 className="text-lg text-neutral-900 mb-6">Orders This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#000000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <h3 className="text-lg text-neutral-900 mb-6">Best Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip />
                <Bar dataKey="sales" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Sales by Category */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <h3 className="text-lg text-neutral-900 mb-6">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-neutral-700">{item.name}</span>
                  </div>
                  <span className="text-neutral-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Orders */}
          <div className="col-span-2 bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg text-neutral-900">Latest Orders</h3>
              <button 
                onClick={() => onNavigate('admin-orders')}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-6 text-sm text-neutral-600">Order #</th>
                    <th className="text-left py-3 px-6 text-sm text-neutral-600">Customer</th>
                    <th className="text-left py-3 px-6 text-sm text-neutral-600">Date</th>
                    <th className="text-right py-3 px-6 text-sm text-neutral-600">Total</th>
                    <th className="text-left py-3 px-6 text-sm text-neutral-600">Status</th>
                    <th className="text-center py-3 px-6 text-sm text-neutral-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
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
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm text-neutral-900">${order.total.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-neutral-600 hover:text-neutral-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
