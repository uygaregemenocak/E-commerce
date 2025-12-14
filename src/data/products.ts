export type ProductColor = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviews: number;
  status: 'In Stock' | 'Limited' | 'Sold Out';
  stockCount: number;
  description: string;
  fabric: string;
  care: string;
  brand: string;
  isActive: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Midnight Silk Gown',
    sku: 'AMR-DRS-001',
    price: 2850,
    images: [
      'https://images.unsplash.com/flagged/photo-1564181595228-a5c75430cdac?w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    ],
    category: 'Evening Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Midnight Blue', value: '#191970' },
      { name: 'Black', value: '#000000' },
    ],
    rating: 5,
    reviews: 24,
    status: 'In Stock',
    stockCount: 8,
    description: 'An exquisite floor-length gown crafted from pure silk. The midnight blue hue captures light beautifully, creating an ethereal presence.',
    fabric: '100% Mulberry Silk',
    care: 'Dry clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '2',
    name: 'Classic Charcoal Suit',
    sku: 'AMR-SUT-002',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1718351041906-d1086f502f8a?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    ],
    category: 'Tailored Suits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Navy', value: '#000080' },
    ],
    rating: 5,
    reviews: 31,
    status: 'In Stock',
    stockCount: 12,
    description: 'Tailored to perfection, this charcoal suit embodies timeless sophistication. Italian wool blend with peak lapels.',
    fabric: 'Italian Wool Blend (80% Wool, 20% Cashmere)',
    care: 'Dry clean only. Steam iron on low heat.',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '3',
    name: 'Cashmere Overcoat',
    sku: 'AMR-OUT-003',
    price: 4100,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    category: 'Outerwear',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Camel', value: '#C19A6B' },
      { name: 'Black', value: '#000000' },
    ],
    rating: 5,
    reviews: 18,
    status: 'Limited',
    stockCount: 3,
    description: 'Luxurious cashmere overcoat with a timeless silhouette. Perfect for the discerning gentleman.',
    fabric: '100% Pure Cashmere',
    care: 'Dry clean only. Store with cedar.',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '4',
    name: 'Pearl Evening Dress',
    sku: 'AMR-DRS-004',
    price: 3600,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
    ],
    category: 'Evening Dresses',
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Pearl', value: '#F0EAD6' },
      { name: 'Ivory', value: '#FFFFF0' },
    ],
    rating: 5,
    reviews: 15,
    status: 'In Stock',
    stockCount: 6,
    description: 'Ethereal pearl-toned evening dress with delicate beading. A showstopper for any gala.',
    fabric: 'Silk Charmeuse with Hand-Sewn Pearls',
    care: 'Professional clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '5',
    name: 'Navy Pinstripe Suit',
    sku: 'AMR-SUT-005',
    price: 2900,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    ],
    category: 'Tailored Suits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', value: '#000080' },
    ],
    rating: 4,
    reviews: 22,
    status: 'In Stock',
    stockCount: 10,
    description: 'Classic navy pinstripe suit with modern slim fit. Italian craftsmanship meets contemporary style.',
    fabric: 'Super 120s Wool',
    care: 'Dry clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '6',
    name: 'Silk Evening Clutch',
    sku: 'AMR-ACC-006',
    price: 850,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Gold', value: '#FFD700' },
    ],
    rating: 5,
    reviews: 45,
    status: 'Sold Out',
    stockCount: 0,
    description: 'Elegant silk clutch with gold-plated hardware. The perfect companion for formal occasions.',
    fabric: 'Silk with Gold-Plated Brass',
    care: 'Store in dust bag',
    brand: 'AMOR',
    isActive: false,
  },
  {
    id: '7',
    name: 'Emerald Velvet Gown',
    sku: 'AMR-DRS-007',
    price: 4200,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    ],
    category: 'Evening Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Emerald', value: '#50C878' },
    ],
    rating: 5,
    reviews: 12,
    status: 'In Stock',
    stockCount: 5,
    description: 'Stunning emerald velvet gown with a dramatic train. Made for unforgettable entrances.',
    fabric: 'Italian Silk Velvet',
    care: 'Professional clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '8',
    name: 'Leather Trench Coat',
    sku: 'AMR-OUT-008',
    price: 3800,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Brown', value: '#8B4513' },
    ],
    rating: 4,
    reviews: 28,
    status: 'Limited',
    stockCount: 4,
    description: 'Premium leather trench coat with satin lining. A statement piece for the modern sophisticate.',
    fabric: 'Full-Grain Italian Leather',
    care: 'Professional leather care only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '9',
    name: 'Rose Gold Watch',
    sku: 'AMR-ACC-009',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Rose Gold', value: '#B76E79' },
    ],
    rating: 5,
    reviews: 56,
    status: 'In Stock',
    stockCount: 15,
    description: 'Elegant rose gold timepiece with Swiss movement. Minimalist design meets exceptional craftsmanship.',
    fabric: '18K Rose Gold Plated Stainless Steel',
    care: 'Wipe with soft cloth',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '10',
    name: 'Burgundy Silk Dress',
    sku: 'AMR-DRS-010',
    price: 2400,
    images: [
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
    ],
    category: 'Evening Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Burgundy', value: '#800020' },
    ],
    rating: 4,
    reviews: 19,
    status: 'In Stock',
    stockCount: 9,
    description: 'Rich burgundy silk dress with flowing silhouette. Perfect for cocktail parties and formal dinners.',
    fabric: '100% Silk Crepe',
    care: 'Dry clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '11',
    name: 'Wool Peacoat',
    sku: 'AMR-OUT-011',
    price: 1850,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    ],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', value: '#000080' },
      { name: 'Charcoal', value: '#36454F' },
    ],
    rating: 5,
    reviews: 34,
    status: 'In Stock',
    stockCount: 11,
    description: 'Classic double-breasted wool peacoat. Timeless maritime-inspired design with modern tailoring.',
    fabric: 'Melton Wool',
    care: 'Dry clean only',
    brand: 'AMOR',
    isActive: true,
  },
  {
    id: '12',
    name: 'Cream Linen Suit',
    sku: 'AMR-SUT-012',
    price: 2700,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    ],
    category: 'Tailored Suits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream', value: '#FFFDD0' },
      { name: 'Beige', value: '#F5F5DC' },
    ],
    rating: 4,
    reviews: 16,
    status: 'In Stock',
    stockCount: 7,
    description: 'Breezy linen suit perfect for summer occasions. Italian linen with unlined construction.',
    fabric: '100% Italian Linen',
    care: 'Dry clean or gentle hand wash',
    brand: 'AMOR',
    isActive: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
}

export function getActiveProducts(): Product[] {
  return products.filter(p => p.isActive);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  
  return products
    .filter(p => p.id !== productId && p.category === product.category && p.isActive)
    .slice(0, limit);
}

