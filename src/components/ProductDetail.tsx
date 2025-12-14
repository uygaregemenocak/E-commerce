import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useCart } from '../stores/cartStore';
import { ImageWithFallback } from './figma/ImageWithFallback';
// Define Product type to match API response
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
  basePrice: string;
  description: string;
  fabric: string | null;
  care: string | null;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  relatedProducts?: Product[];
}

export function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Debug: Log when component mounts or productId changes
  useEffect(() => {
    console.log('[ProductDetail] Component mounted/updated. productId:', productId);
    if (!productId) {
      console.error('[ProductDetail] No productId in URL params!');
      setError('No product ID in URL');
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      setError('No product ID provided');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('[ProductDetail] Fetching product:', productId);

      // Use fetch directly to avoid axios issues
      const response = await fetch(`/api/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('[ProductDetail] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${response.status}` };
        }
        throw new Error(errorData.message || `Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ProductDetail] Response received:', { success: data.success, hasData: !!data.data });

      if (!data.success) {
        throw new Error(data.message || 'Product not found');
      }

      if (!data.data) {
        throw new Error('No product data received');
      }

      const productData = data.data;

      // Validate product data structure
      if (!productData.id || !productData.name) {
        console.error('[ProductDetail] Invalid product data:', productData);
        throw new Error('Invalid product data received - missing id or name');
      }

      console.log('[ProductDetail] Product loaded:', productData.name);
      setProduct(productData);

      // Set default color from first variant
      if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
        const firstVariant = productData.variants[0];
        if (firstVariant && firstVariant.color) {
          console.log('[ProductDetail] Setting default color:', firstVariant.color);
          setSelectedColor(firstVariant.color);
          setSelectedVariant(firstVariant);
        }
      }

      console.log('[ProductDetail] Product loaded successfully');
    } catch (err: any) {
      console.error('[ProductDetail] Error fetching product:', err);
      console.error('[ProductDetail] Error details:', {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
      });

      let errorMessage = 'Failed to load product. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to API server. Please ensure the backend is running and restart the Vite dev server.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      console.log('[ProductDetail] Setting loading to false');
      setLoading(false);
    }
  };

  // Update selected variant when size or color changes
  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      const variant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  // Get available sizes for selected color
  const availableSizes = product
    ? [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size))]
    : [];

  // Get available colors
  const availableColors = product
    ? [...new Set(product.variants.map(v => v.color))]
    : [];

  // Get total stock for product
  const totalStock = product
    ? product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
    : 0;

  // Get stock for selected variant
  const variantStock = selectedVariant ? selectedVariant.stockQuantity : 0;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedVariant) {
      alert('Please select a size');
      return;
    }
    if (variantStock === 0) {
      alert('This variant is out of stock');
      return;
    }

    try {
      await addItem(selectedVariant.id, quantity);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedVariant) {
      alert('Please select a size');
      return;
    }
    if (variantStock === 0) {
      alert('This variant is out of stock');
      return;
    }

    try {
      await addItem(selectedVariant.id, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600 mb-2">Loading product...</p>
          {productId && (
            <div className="mt-4 text-xs text-neutral-400 space-y-1">
              <p>Product ID: {productId}</p>
              <p>API: /api/products/{productId}</p>
              <p className="text-amber-600 mt-2 font-semibold">⚠️ If stuck here, check browser console (F12) for errors</p>
              <p className="text-xs text-neutral-500 mt-4">
                Make sure Vite dev server was restarted after proxy config change
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error || (!loading && !product)) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl text-neutral-900 mb-4">Product Not Found</h1>
          <p className="text-neutral-600 mb-4">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          {productId && (
            <p className="text-xs text-neutral-400 mb-4">Product ID: {productId}</p>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
            <Button onClick={() => fetchProduct()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const productPrice = typeof product.basePrice === 'string' ? parseFloat(product.basePrice) : product.basePrice;
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-200 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={sortedImages[selectedImage]?.url || primaryImage?.url || ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[3/4] bg-neutral-200 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-black' : 'border-transparent'
                      }`}
                  >
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="font-serif text-4xl text-neutral-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">5.0 (12 reviews)</span>
              </div>
              <p className="text-3xl text-neutral-900">${productPrice.toLocaleString()}</p>
            </div>

            <p className="text-neutral-700 mb-8">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="text-sm text-neutral-900 mb-3 block">
                Color: {selectedColor}
              </label>
              <div className="flex gap-2">
                {availableColors.map((color) => {
                  const variant = product.variants.find(v => v.color === color);
                  const colorHex = variant?.colorHex || '#000000';
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(''); // Reset size when color changes
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black scale-110' : 'border-neutral-300'
                        }`}
                      style={{ backgroundColor: colorHex }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            {selectedColor && (
              <div className="mb-6">
                <label className="text-sm text-neutral-900 mb-3 block">Size</label>
                <div className="flex gap-2">
                  {availableSizes.map((size) => {
                    const variant = product.variants.find(
                      v => v.size === size && v.color === selectedColor
                    );
                    const isOutOfStock = !variant || variant.stockQuantity === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`w-12 h-12 border rounded-lg transition-colors ${selectedSize === size
                          ? 'border-black bg-black text-white'
                          : isOutOfStock
                            ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                            : 'border-neutral-300 hover:border-neutral-900'
                          }`}
                        title={isOutOfStock ? 'Out of stock' : ''}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm text-neutral-900 mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(variantStock || totalStock, quantity + 1))}
                    className="p-3 hover:bg-neutral-100"
                    disabled={!selectedVariant || variantStock === 0}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className={`text-sm ${variantStock > 5 ? 'text-green-600' : variantStock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                  {variantStock === 0 ? 'Out of Stock' : variantStock > 5 ? 'In Stock' : `Only ${variantStock} left`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-black hover:bg-neutral-800 h-12"
                disabled={!selectedVariant || variantStock === 0}
              >
                {variantStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1 border-black hover:bg-black hover:text-white h-12"
                disabled={!selectedVariant || variantStock === 0}
              >
                Buy Now
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <RotateCcw className="w-5 h-5" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Shield className="w-5 h-5" />
                <span>2-year warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="mb-16">
          <TabsList className="mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="fabric">Fabric & Care</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="bg-white rounded-lg p-8">
            <h3 className="text-xl text-neutral-900 mb-4">Product Details</h3>
            <p className="text-neutral-700 leading-relaxed">
              {product.description} This piece represents the pinnacle of luxury fashion,
              combining traditional craftsmanship with contemporary design. Each garment is
              meticulously constructed to ensure the perfect drape and fit.
            </p>
          </TabsContent>
          <TabsContent value="fabric" className="bg-white rounded-lg p-8">
            <h3 className="text-xl text-neutral-900 mb-4">Fabric & Care</h3>
            <div className="space-y-4 text-neutral-700">
              <div>
                <strong>Material:</strong> {product.fabric || 'Premium materials'}
              </div>
              <div>
                <strong>Care Instructions:</strong> {product.care || 'Follow care label instructions'}
              </div>
              <div>
                <strong>Origin:</strong> Designed in Paris, Made in Italy
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="bg-white rounded-lg p-8">
            <h3 className="text-xl text-neutral-900 mb-4">Shipping & Returns</h3>
            <div className="space-y-4 text-neutral-700">
              <p>Standard shipping (5-7 business days): Free on orders over $500, otherwise $25</p>
              <p>Express shipping (2-3 business days): $50</p>
              <p>We offer a 30-day return policy for unworn items in original condition with tags attached.</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="bg-white rounded-lg p-8">
            <h3 className="text-xl text-neutral-900 mb-6">Customer Reviews</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-neutral-200 pb-6 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600">Verified Purchaser</span>
                  </div>
                  <p className="text-neutral-700 mb-2">
                    Exceptional quality and fit. Worth every penny. The attention to detail is remarkable.
                  </p>
                  <p className="text-xs text-neutral-500">Posted 2 weeks ago</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* You May Also Like */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl text-neutral-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => {
                const relatedImage = relatedProduct.images?.[0]?.url || '';
                return (
                  <div
                    key={relatedProduct.id}
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-neutral-200 rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={relatedImage}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-neutral-900 mb-1 group-hover:text-amber-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-neutral-900">${(typeof relatedProduct.basePrice === 'string' ? parseFloat(relatedProduct.basePrice) : relatedProduct.basePrice).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
