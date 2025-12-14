import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Search, Edit, Copy, Trash2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string | null;
  stockQuantity: number;
  priceAdjustment: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  brand: string;
  basePrice: string;
  isActive: boolean;
  description: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE_URL = '/api';

export function AllProducts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const onNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'admin-add-product': '/admin/add-product',
    };
    navigate(routeMap[page] || '/admin');
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: ApiResponse = await response.json();
      if (data.success) {
        setProducts(data.data);
        setTotalProducts(data.meta.total);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate total stock for a product
  const getTotalStock = (variants: ProductVariant[]) => {
    return variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  };

  // Get primary image or first image
  const getPrimaryImage = (images: ProductImage[]) => {
    const primary = images.find(img => img.isPrimary);
    return primary?.url || images[0]?.url || '';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category.name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && product.isActive) ||
                          (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600' };
    if (stock <= 5) return { label: 'Low Stock', color: 'text-amber-600' };
    return { label: 'In Stock', color: 'text-green-600' };
  };

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category.name))];

  return (
    <AdminLayout currentPage="admin-products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={fetchProducts}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => onNavigate('admin-add-product')}
              className="bg-black hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error loading products</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchProducts} className="ml-auto">
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
            <span className="ml-3 text-neutral-600">Loading products from database...</span>
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left py-4 px-6 text-sm text-neutral-600">Product</th>
                    <th className="text-left py-4 px-6 text-sm text-neutral-600">SKU</th>
                    <th className="text-left py-4 px-6 text-sm text-neutral-600">Category</th>
                    <th className="text-right py-4 px-6 text-sm text-neutral-600">Price</th>
                    <th className="text-center py-4 px-6 text-sm text-neutral-600">Total Stock</th>
                    <th className="text-center py-4 px-6 text-sm text-neutral-600">Variants</th>
                    <th className="text-center py-4 px-6 text-sm text-neutral-600">Status</th>
                    <th className="text-center py-4 px-6 text-sm text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const totalStock = getTotalStock(product.variants);
                    const stockStatus = getStockStatus(totalStock);
                    const price = parseFloat(product.basePrice);
                    return (
                      <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={getPrimaryImage(product.images)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-sm text-neutral-900 font-medium">{product.name}</span>
                              <p className="text-xs text-neutral-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700 font-mono">{product.sku}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700">{product.category.name}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm text-neutral-900 font-medium">
                            ${price.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm text-neutral-900 font-medium">{totalStock}</span>
                            <span className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-neutral-600">{product.variants.length}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                              product.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4 text-neutral-600" />
                            </button>
                            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Duplicate">
                              <Copy className="w-4 h-4 text-neutral-600" />
                            </button>
                            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-500">
                        No products found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>
            Showing {filteredProducts.length} of {totalProducts} products
            {loading && ' (loading...)'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">
              Data from PostgreSQL database
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
