import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Package, MapPin, CreditCard, Heart, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const orders = [
  {
    id: 'ORD-2024-1156',
    date: 'Nov 18, 2024',
    status: 'Delivered',
    total: 6050,
    items: [
      {
        name: 'Midnight Silk Gown',
        image: 'https://images.unsplash.com/flagged/photo-1564181595228-a5c75430cdac?w=200',
        price: 2850,
        quantity: 1,
      },
      {
        name: 'Classic Charcoal Suit',
        image: 'https://images.unsplash.com/photo-1718351041906-d1086f502f8a?w=200',
        price: 3200,
        quantity: 1,
      },
    ],
    tracking: 'TRK-8934756123',
    address: '123 Main Street, New York, NY 10001',
  },
  {
    id: 'ORD-2024-1089',
    date: 'Nov 10, 2024',
    status: 'Shipped',
    total: 4100,
    items: [
      {
        name: 'Cashmere Overcoat',
        image: 'https://images.unsplash.com/photo-1762605135376-ae5af70a5628?w=200',
        price: 4100,
        quantity: 1,
      },
    ],
    tracking: 'TRK-8934756089',
    address: '123 Main Street, New York, NY 10001',
  },
  {
    id: 'ORD-2024-0987',
    date: 'Oct 28, 2024',
    status: 'Processing',
    total: 2400,
    items: [
      {
        name: 'Burgundy Silk Dress',
        image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=200',
        price: 2400,
        quantity: 1,
      },
    ],
    tracking: '-',
    address: '123 Main Street, New York, NY 10001',
  },
];

export function CustomerOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'cards', label: 'Saved Cards', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      case 'Returned':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl text-neutral-900 mb-8">My Account</h1>

        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="col-span-1">
            <div className="bg-white rounded-lg p-4">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedOrder(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-3">
            {activeTab === 'orders' && !selectedOrder && (
              <div className="bg-white rounded-lg">
                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-4 px-6 text-sm text-neutral-600">Order #</th>
                        <th className="text-left py-4 px-6 text-sm text-neutral-600">Date</th>
                        <th className="text-left py-4 px-6 text-sm text-neutral-600">Status</th>
                        <th className="text-right py-4 px-6 text-sm text-neutral-600">Total</th>
                        <th className="text-right py-4 px-6 text-sm text-neutral-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-4 px-6">
                            <span className="text-sm text-neutral-900">{order.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-neutral-700">{order.date}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-sm text-neutral-900">${order.total.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && selectedOrder && (
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl text-neutral-900">Order Details</h2>
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Back to Orders
                  </Button>
                </div>

                {orders.filter(o => o.id === selectedOrder).map((order) => (
                  <div key={order.id}>
                    {/* Order Info */}
                    <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-neutral-200">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                        <p className="text-neutral-900">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Order Date</p>
                        <p className="text-neutral-900">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-8">
                      <h3 className="text-lg text-neutral-900 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
                            <div className="w-24 h-32 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-neutral-900 mb-2">{item.name}</h4>
                              <p className="text-sm text-neutral-600 mb-2">Quantity: {item.quantity}</p>
                              <p className="text-neutral-900">${item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Tracking */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-lg text-neutral-900 mb-4">Delivery Address</h3>
                        <p className="text-neutral-700">{order.address}</p>
                      </div>
                      <div>
                        <h3 className="text-lg text-neutral-900 mb-4">Tracking Information</h3>
                        <p className="text-neutral-700 mb-2">Tracking Code: {order.tracking}</p>
                        {order.status !== 'Processing' && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-end">
                      <div className="w-64 space-y-3 border-t border-neutral-200 pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-900">Total</span>
                          <span className="text-2xl text-neutral-900">${order.total.toLocaleString()}</span>
                        </div>
                        {order.status === 'Delivered' && (
                          <Button variant="outline" className="w-full">
                            Request Return
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl text-neutral-900 mb-6">Profile Information</h2>
                <p className="text-neutral-600">Profile settings coming soon...</p>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl text-neutral-900 mb-6">My Wishlist</h2>
                <p className="text-neutral-600">Your saved items will appear here...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
