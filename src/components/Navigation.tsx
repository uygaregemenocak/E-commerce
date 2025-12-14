import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useCart } from '../stores/cartStore';

export function Navigation() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartItems = getCartCount();

  const onNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <nav className="bg-black text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <img 
              src="/IMG_8862.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain"
            />
          </button>

          {/* Menu Items */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('products')}
              className="hover:text-amber-400 transition-colors"
            >
              Women
            </button>
            <button 
              onClick={() => onNavigate('products')}
              className="hover:text-amber-400 transition-colors"
            >
              Men
            </button>
            <button 
              onClick={() => onNavigate('products')}
              className="hover:text-amber-400 transition-colors"
            >
              New Arrivals
            </button>
            <button 
              onClick={() => onNavigate('products')}
              className="hover:text-amber-400 transition-colors"
            >
              Collections
            </button>
            <button className="hover:text-amber-400 transition-colors">About</button>
            <button className="hover:text-amber-400 transition-colors">Contact</button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button className="hover:text-amber-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {/* User/Account Icon */}
            {user ? (
              <button 
                onClick={() => onNavigate('orders')}
                className="hover:text-amber-400 transition-colors"
                title={user.name}
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="hover:text-amber-400 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            
            {/* Wishlist - always visible */}
            <button className="hover:text-amber-400 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            
            {/* Cart - always visible */}
            <button 
              onClick={() => onNavigate('cart')}
              className="hover:text-amber-400 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartItems}
                </span>
              )}
            </button>
            
            {/* Logout button - only when logged in */}
            {user && (
              <button 
                onClick={handleLogout}
                className="text-sm hover:text-amber-400 transition-colors ml-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
