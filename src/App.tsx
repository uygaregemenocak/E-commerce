import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { CartProvider } from './stores/cartStore';
import { Landing } from './components/Landing';
import { Home } from './components/Home';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { CustomerOrders } from './components/CustomerOrders';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AddProduct } from './components/admin/AddProduct';
import { AllProducts } from './components/admin/AllProducts';
import { BarcodeScanning } from './components/admin/BarcodeScanning';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { CustomerDetail } from './components/admin/CustomerDetail';
import { OrderManagement } from './components/admin/OrderManagement';
import { ReturnsManagement } from './components/admin/ReturnsManagement';
import { SearchReports } from './components/admin/SearchReports';
import { RoleManagement } from './components/admin/RoleManagement';
import { AdminSettings } from './components/admin/AdminSettings';
import { OrderConfirmation } from './components/OrderConfirmation';

type UserRole = 'admin' | 'store-manager' | 'warehouse' | 'support' | 'customer';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string, role?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// No wrapper needed - ProductDetail uses useParams directly

// Wrapper for CustomerDetail to pass the id param
function CustomerDetailWrapper() {
  const { id } = useParams();
  return <CustomerDetail customerId={id} />;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AllProducts />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/barcode" element={<BarcodeScanning />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/customers/:id" element={<CustomerDetailWrapper />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/returns" element={<ReturnsManagement />} />
        <Route path="/admin/reports" element={<SearchReports />} />
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User>(null);

  const login = (email: string, _password: string, role?: string) => {
    const userRole = (role || 'customer') as UserRole;
    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
      role: userRole,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const authValue = { user, login, logout };

  return (
    <AuthContext.Provider value={authValue}>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthContext.Provider>
  );
}
