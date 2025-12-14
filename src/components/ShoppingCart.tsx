import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../stores/cartStore';

export function ShoppingCart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getCartTotal, loading, error } = useCart();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getCartTotal();

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          </div>
        )}

        <h1 className="font-serif text-4xl text-neutral-900 mb-8">Shopping Cart</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-neutral-600 mb-4">Your cart is empty</p>
                <Button onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 text-sm text-neutral-600">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Color</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-1 text-right">Price</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>

                {/* Cart Items */}
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-20 h-28 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-neutral-900">{item.name}</h3>
                          {item.stockQuantity < 5 && (
                            <p className="text-xs text-amber-600 mt-1">Only {item.stockQuantity} left</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-neutral-700">{item.size}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-neutral-700">{item.color}</span>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center border border-neutral-300 rounded-lg w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="p-1.5 hover:bg-neutral-100 disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm text-neutral-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stockQuantity))}
                            disabled={loading || item.quantity >= item.stockQuantity}
                            className="p-1.5 hover:bg-neutral-100 disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-neutral-900">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4 text-neutral-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h2 className="text-xl text-neutral-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-900">
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                {shipping === 0 && items.length > 0 && (
                  <p className="text-xs text-green-600">
                    You've qualified for free shipping!
                  </p>
                )}
                {shipping > 0 && items.length > 0 && (
                  <p className="text-xs text-neutral-600">
                    Add ${(500 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-2xl text-neutral-900">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black hover:bg-neutral-800 mb-3"
                disabled={items.length === 0 || loading}
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
