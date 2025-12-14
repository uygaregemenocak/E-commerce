import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.returnItem.deleteMany();
  await prisma.return.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('📦 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Evening Dresses', slug: 'evening-dresses' } }),
    prisma.category.create({ data: { name: 'Tailored Suits', slug: 'tailored-suits' } }),
    prisma.category.create({ data: { name: 'Outerwear', slug: 'outerwear' } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories' } }),
  ]);

  const [eveningDresses, tailoredSuits, outerwear, accessories] = categories;

  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@amor.com',
      passwordHash,
      name: 'Admin User',
      phone: '+1 (555) 000-0001',
      role: 'admin',
      memberId: 'AMR-ADMIN-001',
    },
  });

  const storeManager = await prisma.user.create({
    data: {
      email: 'manager@amor.com',
      passwordHash,
      name: 'Store Manager',
      phone: '+1 (555) 000-0002',
      role: 'store_manager',
      memberId: 'AMR-MGR-001',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'sarah.j@email.com',
      passwordHash,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      role: 'customer',
      memberId: 'AMR-CUST-001',
      membershipLevel: 'Platinum',
      addresses: {
        create: {
          type: 'shipping',
          street: '123 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true,
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'michael.c@email.com',
      passwordHash,
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      role: 'customer',
      memberId: 'AMR-CUST-002',
      membershipLevel: 'Gold',
      addresses: {
        create: {
          type: 'shipping',
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          isDefault: true,
        },
      },
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'customer@amor.com',
      passwordHash,
      name: 'Demo Customer',
      phone: '+1 (555) 999-9999',
      role: 'customer',
      memberId: 'AMR-CUST-999',
      membershipLevel: 'Standard',
    },
  });

  console.log('👗 Creating products...');
  
  // Product 1: Midnight Silk Gown
  const product1 = await prisma.product.create({
    data: {
      name: 'Midnight Silk Gown',
      sku: 'AMR-DRS-001',
      slug: 'midnight-silk-gown',
      brand: 'AMOR',
      categoryId: eveningDresses.id,
      description: 'An exquisite floor-length gown crafted from pure silk. The midnight blue hue captures light beautifully, creating an ethereal presence.',
      fabric: '100% Mulberry Silk',
      care: 'Dry clean only',
      basePrice: 2850,
      images: {
        create: [
          { url: 'https://images.unsplash.com/flagged/photo-1564181595228-a5c75430cdac?w=800', alt: 'Midnight Silk Gown', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', alt: 'Midnight Silk Gown Side', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: 'XS', color: 'Midnight Blue', colorHex: '#191970', stockQuantity: 3 },
          { size: 'S', color: 'Midnight Blue', colorHex: '#191970', stockQuantity: 5 },
          { size: 'M', color: 'Midnight Blue', colorHex: '#191970', stockQuantity: 4 },
          { size: 'L', color: 'Midnight Blue', colorHex: '#191970', stockQuantity: 2 },
          { size: 'XS', color: 'Black', colorHex: '#000000', stockQuantity: 2 },
          { size: 'S', color: 'Black', colorHex: '#000000', stockQuantity: 3 },
          { size: 'M', color: 'Black', colorHex: '#000000', stockQuantity: 4 },
          { size: 'L', color: 'Black', colorHex: '#000000', stockQuantity: 2 },
        ],
      },
    },
  });

  // Product 2: Classic Charcoal Suit
  const product2 = await prisma.product.create({
    data: {
      name: 'Classic Charcoal Suit',
      sku: 'AMR-SUT-002',
      slug: 'classic-charcoal-suit',
      brand: 'AMOR',
      categoryId: tailoredSuits.id,
      description: 'Tailored to perfection, this charcoal suit embodies timeless sophistication. Italian wool blend with peak lapels.',
      fabric: 'Italian Wool Blend (80% Wool, 20% Cashmere)',
      care: 'Dry clean only. Steam iron on low heat.',
      basePrice: 3200,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1718351041906-d1086f502f8a?w=800', alt: 'Classic Charcoal Suit', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', alt: 'Classic Charcoal Suit Detail', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: 'S', color: 'Charcoal', colorHex: '#36454F', stockQuantity: 4 },
          { size: 'M', color: 'Charcoal', colorHex: '#36454F', stockQuantity: 6 },
          { size: 'L', color: 'Charcoal', colorHex: '#36454F', stockQuantity: 5 },
          { size: 'XL', color: 'Charcoal', colorHex: '#36454F', stockQuantity: 3 },
          { size: 'S', color: 'Navy', colorHex: '#000080', stockQuantity: 3 },
          { size: 'M', color: 'Navy', colorHex: '#000080', stockQuantity: 4 },
          { size: 'L', color: 'Navy', colorHex: '#000080', stockQuantity: 4 },
          { size: 'XL', color: 'Navy', colorHex: '#000080', stockQuantity: 2 },
        ],
      },
    },
  });

  // Product 3: Cashmere Overcoat
  const product3 = await prisma.product.create({
    data: {
      name: 'Cashmere Overcoat',
      sku: 'AMR-OUT-003',
      slug: 'cashmere-overcoat',
      brand: 'AMOR',
      categoryId: outerwear.id,
      description: 'Luxurious cashmere overcoat with a timeless silhouette. Perfect for the discerning gentleman.',
      fabric: '100% Pure Cashmere',
      care: 'Dry clean only. Store with cedar.',
      basePrice: 4100,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', alt: 'Cashmere Overcoat', isPrimary: true, sortOrder: 0 },
        ],
      },
      variants: {
        create: [
          { size: 'M', color: 'Camel', colorHex: '#C19A6B', stockQuantity: 2 },
          { size: 'L', color: 'Camel', colorHex: '#C19A6B', stockQuantity: 2 },
          { size: 'XL', color: 'Camel', colorHex: '#C19A6B', stockQuantity: 1 },
          { size: 'M', color: 'Black', colorHex: '#000000', stockQuantity: 2 },
          { size: 'L', color: 'Black', colorHex: '#000000', stockQuantity: 3 },
          { size: 'XL', color: 'Black', colorHex: '#000000', stockQuantity: 2 },
        ],
      },
    },
  });

  // Product 4: Pearl Evening Dress
  const product4 = await prisma.product.create({
    data: {
      name: 'Pearl Evening Dress',
      sku: 'AMR-DRS-004',
      slug: 'pearl-evening-dress',
      brand: 'AMOR',
      categoryId: eveningDresses.id,
      description: 'Ethereal pearl-toned evening dress with delicate beading. A showstopper for any gala.',
      fabric: 'Silk Charmeuse with Hand-Sewn Pearls',
      care: 'Professional clean only',
      basePrice: 3600,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', alt: 'Pearl Evening Dress', isPrimary: true, sortOrder: 0 },
        ],
      },
      variants: {
        create: [
          { size: 'XS', color: 'Pearl', colorHex: '#F0EAD6', stockQuantity: 2 },
          { size: 'S', color: 'Pearl', colorHex: '#F0EAD6', stockQuantity: 3 },
          { size: 'M', color: 'Pearl', colorHex: '#F0EAD6', stockQuantity: 2 },
        ],
      },
    },
  });

  // Product 5: Rose Gold Watch
  const product5 = await prisma.product.create({
    data: {
      name: 'Rose Gold Watch',
      sku: 'AMR-ACC-009',
      slug: 'rose-gold-watch',
      brand: 'AMOR',
      categoryId: accessories.id,
      description: 'Elegant rose gold timepiece with Swiss movement. Minimalist design meets exceptional craftsmanship.',
      fabric: '18K Rose Gold Plated Stainless Steel',
      care: 'Wipe with soft cloth',
      basePrice: 1200,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800', alt: 'Rose Gold Watch', isPrimary: true, sortOrder: 0 },
        ],
      },
      variants: {
        create: [
          { size: 'One Size', color: 'Rose Gold', colorHex: '#B76E79', stockQuantity: 15 },
        ],
      },
    },
  });

  // Product 6: Emerald Velvet Gown
  const product6 = await prisma.product.create({
    data: {
      name: 'Emerald Velvet Gown',
      sku: 'AMR-DRS-007',
      slug: 'emerald-velvet-gown',
      brand: 'AMOR',
      categoryId: eveningDresses.id,
      description: 'Stunning emerald velvet gown with a dramatic train. Made for unforgettable entrances.',
      fabric: 'Italian Silk Velvet',
      care: 'Professional clean only',
      basePrice: 4200,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', alt: 'Emerald Velvet Gown', isPrimary: true, sortOrder: 0 },
        ],
      },
      variants: {
        create: [
          { size: 'XS', color: 'Emerald', colorHex: '#50C878', stockQuantity: 2 },
          { size: 'S', color: 'Emerald', colorHex: '#50C878', stockQuantity: 3 },
          { size: 'M', color: 'Emerald', colorHex: '#50C878', stockQuantity: 2 },
          { size: 'L', color: 'Emerald', colorHex: '#50C878', stockQuantity: 1 },
        ],
      },
    },
  });

  console.log('📦 Creating sample orders...');
  
  // Get a variant for the order
  const variant1 = await prisma.productVariant.findFirst({
    where: { productId: product1.id, size: 'M' },
    include: { product: true },
  });

  const variant2 = await prisma.productVariant.findFirst({
    where: { productId: product2.id, size: 'L' },
    include: { product: true },
  });

  if (variant1 && variant2) {
    // Create order for customer1
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-1248',
        userId: customer1.id,
        status: 'processing',
        subtotal: 2850,
        shipping: 0,
        tax: 0,
        total: 2850,
        items: {
          create: {
            variantId: variant1.id,
            quantity: 1,
            unitPrice: 2850,
            productSnapshot: {
              name: variant1.product.name,
              sku: variant1.product.sku,
              size: variant1.size,
              color: variant1.color,
            },
          },
        },
        payment: {
          create: {
            method: 'card',
            status: 'paid',
            amount: 2850,
            transactionId: 'TXN-12345678',
          },
        },
        shipment: {
          create: {
            carrier: 'FedEx',
            status: 'pending',
          },
        },
      },
    });

    // Create order for customer2
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-1247',
        userId: customer2.id,
        status: 'shipped',
        subtotal: 3200,
        shipping: 0,
        tax: 0,
        total: 3200,
        items: {
          create: {
            variantId: variant2.id,
            quantity: 1,
            unitPrice: 3200,
            productSnapshot: {
              name: variant2.product.name,
              sku: variant2.product.sku,
              size: variant2.size,
              color: variant2.color,
            },
          },
        },
        payment: {
          create: {
            method: 'card',
            status: 'paid',
            amount: 3200,
            transactionId: 'TXN-12345679',
          },
        },
        shipment: {
          create: {
            carrier: 'UPS',
            trackingNumber: 'TRK-8934756246',
            status: 'in_transit',
            shippedAt: new Date(),
          },
        },
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin: admin@amor.com / password123');
  console.log('  Manager: manager@amor.com / password123');
  console.log('  Customer: customer@amor.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

