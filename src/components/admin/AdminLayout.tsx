import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Archive, 
  BarChart3, 
  Shield, 
  Settings,
  Bell,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';

type AdminLayoutProps = {
  children: React.ReactNode;
  currentPage: string;
};

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'admin-dashboard': '/admin',
      'admin-products': '/admin/products',
      'admin-add-product': '/admin/add-product',
      'admin-barcode': '/admin/barcode',
      'admin-customers': '/admin/customers',
      'admin-orders': '/admin/orders',
      'admin-returns': '/admin/returns',
      'admin-search': '/admin/reports',
      'admin-roles': '/admin/roles',
      'admin-settings': '/admin/settings',
    };
    navigate(routeMap[page] || '/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-products', label: 'Products', icon: Package },
    { id: 'admin-add-product', label: 'Add Product', icon: Package, indent: true },
    { id: 'admin-barcode', label: 'Barcode Scan', icon: Archive, indent: true },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { id: 'admin-orders', label: 'Orders', icon: ShoppingCart },
    { id: 'admin-returns', label: 'Returns', icon: Archive },
    { id: 'admin-search', label: 'Search & Reports', icon: BarChart3 },
    { id: 'admin-roles', label: 'Roles & Permissions', icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <span className="font-serif italic text-sm">A</span>
            </div>
            <span className="font-serif text-xl">Amor</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  item.indent ? 'pl-12' : ''
                } ${
                  isActive
                    ? 'bg-amber-500 text-black'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={() => onNavigate('admin-settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              currentPage === 'admin-settings'
                ? 'bg-amber-500 text-black'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl text-neutral-900">{menuItems.find(m => m.id === currentPage)?.label || 'Admin Panel'}</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-neutral-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                <div className="w-8 h-8 bg-neutral-800 text-white rounded-full flex items-center justify-center">
                  <span className="text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
