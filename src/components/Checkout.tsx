import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../stores/cartStore';
import { useAuth } from '../App';
import { ordersApi } from '../api/orders';
import { toast } from 'sonner';

export function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const subtotal = getSubtotal();
  const shipping = deliveryMethod === 'express' ? 50 : (subtotal > 500 ? 0 : 25);
  const total = subtotal + shipping;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      // Small delay to ensure auth check is complete
      const timer = setTimeout(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('Please login to checkout');
          navigate('/login');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleStateChange = (value: string) => {
    setShippingAddress(prev => ({ ...prev, state: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || '';

      await ordersApi.createOrder({
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: 'USA'
        },
        paymentMethod,
        deliveryMethod
      }, token);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Redirect to cart if empty (and not just checking auth)
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl text-neutral-900 mb-4">Your Cart is Empty</h1>
          <p className="text-neutral-600 mb-8">Add some items to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl text-neutral-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' },
            ].map((item, index) => (
              <React.Fragment key={item.num}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step >= item.num
                        ? 'bg-black text-white'
                        : 'bg-neutral-200 text-neutral-500'
                      }`}
                  >
                    {step > item.num ? <Check className="w-5 h-5" /> : item.num}
                  </div>
                  <span
                    className={`text-sm ${step >= item.num ? 'text-neutral-900' : 'text-neutral-500'
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-24 h-0.5 ${step > item.num ? 'bg-black' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl text-neutral-900 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="mt-2"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="123 Main Street"
                      className="mt-2"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      className="mt-2"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={handleStateChange} value={shippingAddress.state}>
                      <SelectTrigger id="state" className="mt-2">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      className="mt-2"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="mt-2"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-black hover:bg-neutral-800"
                    disabled={!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode}
                  >
                    Continue to Delivery
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Options */}
            {step === 2 && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl text-neutral-900 mb-6">Delivery Method</h2>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div>
                            <p className="text-neutral-900">Standard Shipping</p>
                            <p className="text-sm text-neutral-600">5-7 business days</p>
                          </div>
                        </Label>
                      </div>
                      <span className="text-neutral-900">{subtotal > 500 ? 'Free' : '$25'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div>
                            <p className="text-neutral-900">Express Shipping</p>
                            <p className="text-sm text-neutral-600">2-3 business days</p>
                          </div>
                        </Label>
                      </div>
                      <span className="text-neutral-900">$50</span>
                    </div>
                  </div>
                </RadioGroup>
                <div className="mt-8 flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-black hover:bg-neutral-800">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl text-neutral-900 mb-6">Payment Information</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-neutral-300 rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-neutral-300 rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" className="mt-2" />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button onClick={() => setStep(2)} variant="outline">
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="bg-black hover:bg-neutral-800"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h2 className="text-xl text-neutral-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-28 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-neutral-900 mb-1">{item.name}</h3>
                      <p className="text-xs text-neutral-600 mb-1">Size: {item.size}</p>
                      <p className="text-xs text-neutral-600 mb-2">Qty: {item.quantity}</p>
                      <p className="text-sm text-neutral-900">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-neutral-200 pt-6">
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
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-2xl text-neutral-900">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
