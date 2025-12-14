import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const API_BASE_URL = '/api';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
}

interface ProductImage {
  id: string;
  url: string;
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
  basePrice: string;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

const categories = ['All', 'Evening Dresses', 'Tailored Suits', 'Outerwear', 'Accessories'];

export function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?limit=20`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category.name === selectedCategory);

  const getProductPrice = (product: Product) => {
    return parseFloat(product.basePrice);
  };

  const getProductStatus = (product: Product) => {
    const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    if (totalStock === 0) return { text: 'Sold Out', color: 'text-neutral-500' };
    if (totalStock < 5) return { text: 'Limited', color: 'text-amber-500' };
    return { text: 'In Stock', color: 'text-green-500' };
  };

  const getPrimaryImage = (product: Product) => {
    const primary = product.images.find(img => img.isPrimary);
    return primary?.url || product.images[0]?.url || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[600px] bg-black overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1761637986331-39a8748dd84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc2MzczMzg4OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-xl">
            <h1 className="font-serif text-6xl mb-6">
              Timeless Couture for the Modern Era
            </h1>
            <p className="text-xl mb-8 text-neutral-300">
              Discover exclusive collections that define elegance
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/products?gender=women')}
                className="bg-white text-black hover:bg-neutral-100"
              >
                Shop Women
              </Button>
              <Button 
                onClick={() => navigate('/products?gender=men')}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
              >
                Shop Men
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-4 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  selectedCategory === category
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const status = getProductStatus(product);
              const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              
              return (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden rounded-lg">
                    <ImageWithFallback 
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-2 text-sm">
                          All Sold Out
                        </span>
                      </div>
                    )}
                    {totalStock > 0 && totalStock < 5 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-amber-500 text-black px-3 py-1 text-xs">
                          Limited Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < 5 ? 'fill-amber-500 text-amber-500' : 'text-neutral-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">5.0</span>
                    </div>
                    <p className="text-white">${getProductPrice(product).toLocaleString()}</p>
                    <p className={`text-xs mt-1 ${status.color}`}>
                      {status.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
