import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export function OrderConfirmation() {
  const navigate = useNavigate();
  // Generate a mock order ID if not provided
  const displayOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Calculate estimated delivery (5-7 business days from now)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 5);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 7);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl text-neutral-900 mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-neutral-600">
            Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Order Number</p>
              <p className="text-xl font-semibold text-neutral-900">{displayOrderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-600 mb-1">Order Date</p>
              <p className="text-neutral-900">{formatDate(today)}</p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Order Confirmed</p>
                <p className="text-sm text-neutral-600">Your order has been received and is being processed.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-500">Preparing Your Order</p>
                <p className="text-sm text-neutral-400">We're carefully packaging your items.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-500">Out for Delivery</p>
                <p className="text-sm text-neutral-400">Your package is on its way.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-500">Estimated Delivery</p>
                <p className="text-sm text-neutral-400">
                  {formatDate(deliveryStart)} – {formatDate(deliveryEnd)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-amber-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• A confirmation email has been sent to your email address.</li>
            <li>• You'll receive a shipping notification when your order ships.</li>
            <li>• Track your order status in your account dashboard.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/orders')}
            className="bg-black hover:bg-neutral-800"
          >
            View Order Details
          </Button>
          <Button 
            onClick={() => navigate('/home')}
            variant="outline"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

