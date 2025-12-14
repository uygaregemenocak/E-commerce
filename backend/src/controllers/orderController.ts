import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('USA'),
  }),
  paymentMethod: z.string().default('card'),
  deliveryMethod: z.string().default('standard'),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
});

export class OrderController {
  getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const isAdmin = ['admin', 'store-manager', 'warehouse', 'support'].includes(req.user?.role || '');
      
      const where = isAdmin ? {} : { userId };

      const orders = await prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true }, take: 1 } },
                  },
                },
              },
            },
          },
          payment: true,
          shipment: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const formattedOrders = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user,
        status: order.status,
        date: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          name: item.variant.product.name,
          size: item.variant.size,
          color: item.variant.color,
          quantity: item.quantity,
          price: Number(item.unitPrice),
          image: item.variant.product.images[0]?.url || '',
        })),
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        total: Number(order.total),
        payment: order.payment,
        shipment: order.shipment,
      }));

      res.json({
        success: true,
        data: formattedOrders,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const isAdmin = ['admin', 'store-manager', 'warehouse', 'support'].includes(req.user?.role || '');

      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }],
          ...(isAdmin ? {} : { userId }),
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          shippingAddress: true,
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true }, take: 1 } },
                  },
                },
              },
            },
          },
          payment: true,
          shipment: true,
        },
      });

      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, 'Authentication required');
      }

      const { shippingAddress, paymentMethod, deliveryMethod } = createOrderSchema.parse(req.body);

      // Get user's cart
      const cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError(400, 'Cart is empty');
      }

      // Check stock for all items
      for (const item of cart.items) {
        if (item.variant.stockQuantity < item.quantity) {
          throw new AppError(400, `Not enough stock for ${item.variant.product.name}`);
        }
      }

      // Calculate totals
      const subtotal = cart.items.reduce((sum, item) => {
        const price = Number(item.variant.product.basePrice) + Number(item.variant.priceAdjustment);
        return sum + price * item.quantity;
      }, 0);
      const shipping = deliveryMethod === 'express' ? 50 : (subtotal > 500 ? 0 : 25);
      const total = subtotal + shipping;

      // Create address
      const address = await prisma.address.create({
        data: {
          userId,
          type: 'shipping',
          ...shippingAddress,
        },
      });

      // Generate order number
      const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

      // Create order with items
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          status: 'pending',
          shippingAddressId: address.id,
          subtotal,
          shipping,
          tax: 0,
          total,
          items: {
            create: cart.items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: Number(item.variant.product.basePrice) + Number(item.variant.priceAdjustment),
              productSnapshot: {
                productId: item.variant.productId,
                name: item.variant.product.name,
                sku: item.variant.product.sku,
                size: item.variant.size,
                color: item.variant.color,
              },
            })),
          },
          payment: {
            create: {
              method: paymentMethod,
              status: 'paid', // Mock payment success
              amount: total,
              transactionId: `TXN-${Date.now()}`,
            },
          },
          shipment: {
            create: {
              status: 'pending',
            },
          },
        },
        include: {
          items: true,
          payment: true,
          shipment: true,
        },
      });

      // Update stock
      for (const item of cart.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // Update order status to paid (mock payment success)
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'paid' },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      res.status(201).json({
        success: true,
        data: { ...order, status: 'paid' },
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = updateStatusSchema.parse(req.body);

      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      await prisma.order.update({
        where: { id },
        data: { status },
      });

      // Update shipment if shipped
      if (status === 'shipped' && trackingNumber) {
        await prisma.shipment.update({
          where: { orderId: id },
          data: {
            status: 'shipped',
            trackingNumber,
            shippedAt: new Date(),
          },
        });
      }

      if (status === 'delivered') {
        await prisma.shipment.update({
          where: { orderId: id },
          data: {
            status: 'delivered',
            deliveredAt: new Date(),
          },
        });
      }

      res.json({
        success: true,
        message: 'Order status updated',
      });
    } catch (error) {
      next(error);
    }
  };
}

