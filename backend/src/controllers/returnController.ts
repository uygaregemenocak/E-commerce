import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const createReturnSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(1),
  condition: z.enum(['new', 'used', 'damaged']).default('new'),
  resolution: z.enum(['refund', 'exchange', 'store_credit']).default('refund'),
  items: z.array(z.object({
    orderItemId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })),
});

const updateReturnSchema = z.object({
  status: z.enum(['pending', 'approved', 'processing', 'completed', 'rejected']),
  notes: z.string().optional(),
});

export class ReturnController {
  getReturns = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const isAdmin = ['admin', 'store-manager', 'support'].includes(req.user?.role || '');
      
      const where = isAdmin ? {} : { userId };

      const returns = await prisma.return.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          order: { select: { id: true, orderNumber: true } },
          items: {
            include: {
              orderItem: {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const formattedReturns = returns.map(ret => ({
        id: ret.id,
        returnNumber: ret.returnNumber,
        orderId: ret.orderId,
        orderNumber: ret.order.orderNumber,
        customer: ret.user,
        status: ret.status,
        reason: ret.reason,
        condition: ret.condition,
        resolution: ret.resolution,
        items: ret.items.map(item => ({
          id: item.id,
          name: item.orderItem.variant.product.name,
          size: item.orderItem.variant.size,
          color: item.orderItem.variant.color,
          quantity: item.quantity,
          image: item.orderItem.variant.product.images[0]?.url || '',
        })),
        createdAt: ret.createdAt,
        resolvedAt: ret.resolvedAt,
      }));

      res.json({
        success: true,
        data: formattedReturns,
      });
    } catch (error) {
      next(error);
    }
  };

  getReturnById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const isAdmin = ['admin', 'store-manager', 'support'].includes(req.user?.role || '');

      const ret = await prisma.return.findFirst({
        where: {
          OR: [{ id }, { returnNumber: id }],
          ...(isAdmin ? {} : { userId }),
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          order: true,
          items: {
            include: {
              orderItem: {
                include: {
                  variant: {
                    include: {
                      product: {
                        include: { images: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!ret) {
        throw new AppError(404, 'Return not found');
      }

      res.json({
        success: true,
        data: ret,
      });
    } catch (error) {
      next(error);
    }
  };

  createReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, 'Authentication required');
      }

      const { orderId, reason, condition, resolution, items } = createReturnSchema.parse(req.body);

      // Verify order belongs to user
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
      });

      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      if (order.status !== 'delivered') {
        throw new AppError(400, 'Can only return delivered orders');
      }

      // Generate return number
      const returnNumber = `RET-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;

      const returnRequest = await prisma.return.create({
        data: {
          returnNumber,
          orderId,
          userId,
          reason,
          condition,
          resolution,
          status: 'pending',
          items: {
            create: items.map(item => ({
              orderItemId: item.orderItemId,
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      res.status(201).json({
        success: true,
        data: returnRequest,
      });
    } catch (error) {
      next(error);
    }
  };

  updateReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = updateReturnSchema.parse(req.body);

      const ret = await prisma.return.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!ret) {
        throw new AppError(404, 'Return not found');
      }

      const updateData: any = { status, notes };
      
      if (status === 'completed' || status === 'rejected') {
        updateData.resolvedAt = new Date();
      }

      // If approved/completed, restore stock for returned items
      if (status === 'completed') {
        for (const item of ret.items) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }

      const updated = await prisma.return.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}

