import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Star, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../data/products';

export function ProductListing() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popularity');

  const categories = ['Evening Dresses', 'Tailored Suits', 'Outerwear', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
  const colors = ['Black', 'Navy', 'Charcoal', 'Camel', 'Pearl', 'Ivory', 'Emerald', 'Brown', 'Rose Gold', 'Burgundy', 'Cream', 'Beige', 'Gold'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch valid active products with a high limit to support client-side filtering
        const queryParams = new URLSearchParams({
          limit: '100', // Fetch enough items for client-side filtering
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
        });

        // If exactly one category is selected, we can filter on server.
        // Otherwise fetch all and filter on client.
        if (selectedCategories.length === 1) {
           // We'll rely on client-side filtering so multiple categories works seamlessly
           // without complex OR logic on the backend for now.
        }

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform backend data to frontend Product interface
          const transformedProducts: Product[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            price: Number(item.basePrice),
            images: item.images?.map((img: any) => img.url) || [],
            category: item.category?.name || 'Uncategorized',
            sizes: [...new Set(item.variants?.map((v: any) => v.size) || [])] as string[],
            colors: [...new Set(item.variants?.map((v: any) => ({ name: v.color, value: v.colorHex || '#000000' })) || [])],
            rating: 5, // Default for now as backend doesn't have ratings yet
            reviews: 0,
            status: !item.isActive ? 'Sold Out' : (item.variants?.reduce((acc: number, v: any) => acc + v.stockQuantity, 0) || 0) < 5 ? 'Limited' : 'In Stock',
            stockCount: item.variants?.reduce((acc: number, v: any) => acc + v.stockQuantity, 0) || 0,
            description: item.description,
            fabric: item.fabric || '',
            care: item.care || '',
            brand: item.brand,
            isActive: item.isActive
          }));
          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch when price range changes to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [priceRange]); // Fetch when price changes (server filtering)

  // Client-side filtering for other attributes
  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) return false;
    if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c.name))) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.id.localeCompare(a.id); // Approximation for newest
    return 0;
  });

  const toggleFilter = (value: string, selectedArray: string[], setFunction: (arr: string[]) => void) => {
    if (selectedArray.includes(value)) {
      setFunction(selectedArray.filter(item => item !== value));
    } else {
      setFunction([...selectedArray, value]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-neutral-900" />
                <h2 className="text-lg text-neutral-900">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm text-neutral-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                      />
                      <Label htmlFor={category} className="text-sm text-neutral-700">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="text-sm text-neutral-900 mb-3">Size</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <Checkbox
                        id={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                      />
                      <Label htmlFor={size} className="text-sm text-neutral-700">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="text-sm text-neutral-900 mb-3">Color</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center gap-2">
                      <Checkbox
                        id={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => toggleFilter(color, selectedColors, setSelectedColors)}
                      />
                      <Label htmlFor={color} className="text-sm text-neutral-700">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm text-neutral-900 mb-3">Price Range</h3>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSizes([]);
                  setSelectedColors([]);
                  setPriceRange([0, 5000]);
                }}
                variant="outline"
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">
                {loading ? 'Loading...' : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`}
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm text-neutral-600">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-neutral-300 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-neutral-900 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-neutral-500 text-lg">No products found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setPriceRange([0, 5000]);
                  }} 
                  variant="link" 
                  className="mt-2 text-amber-600"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="group cursor-pointer bg-white rounded-lg overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.status === 'Sold Out' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-white text-black px-4 py-2 text-sm">
                            All Sold Out
                          </span>
                        </div>
                      )}
                      {product.status === 'Limited' && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-500 text-black px-3 py-1 text-xs">
                            Limited Stock
                          </span>
                        </div>
                      )}
                      <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs">👁</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-neutral-900 mb-1 group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < product.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500">{product.rating}.0</span>
                      </div>
                      <p className="text-neutral-900">${product.price.toLocaleString()}</p>
                      <p
                        className={`text-xs mt-1 ${
                          product.status === 'In Stock'
                            ? 'text-green-600'
                            : product.status === 'Limited'
                            ? 'text-amber-600'
                            : 'text-neutral-400'
                        }`}
                      >
                        {product.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
