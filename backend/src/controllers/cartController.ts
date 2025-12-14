import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const addItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive().default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export class CartController {
  private getOrCreateCart = async (userId?: string, sessionId?: string) => {
    // 1. Try to find cart by userId
    if (userId) {
      let userCart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isPrimary: true }, take: 1 },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 2. Check if there is a session cart to merge
      if (sessionId) {
        const sessionCart = await prisma.cart.findFirst({
          where: { sessionId, userId: null },
          include: { items: true },
        });

        if (sessionCart) {
          if (!userCart) {
            // If no user cart, simply claim the session cart
            userCart = await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId },
              include: {
                items: {
                  include: {
                    variant: {
                      include: {
                        product: {
                          include: {
                            images: { where: { isPrimary: true }, take: 1 },
                          },
                        },
                      },
                    },
                  },
                },
              }
            });
          } else {
            // Merge items: move session items to user cart
            for (const item of sessionCart.items) {
              // Check if item exists in user cart
              const existing = await prisma.cartItem.findFirst({
                where: { cartId: userCart.id, variantId: item.variantId }
              });

              if (existing) {
                await prisma.cartItem.update({
                  where: { id: existing.id },
                  data: { quantity: existing.quantity + item.quantity }
                });
              } else {
                await prisma.cartItem.create({
                  data: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity }
                });
              }
            }
            // Delete old session cart
            await prisma.cart.delete({ where: { id: sessionCart.id } });

            // Refetch to get updated items
            userCart = await prisma.cart.findFirst({
              where: { id: userCart.id },
              include: {
                items: {
                  include: {
                    variant: {
                      include: {
                        product: {
                          include: {
                            images: { where: { isPrimary: true }, take: 1 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            });
          }
        }
      }

      if (userCart) return userCart;
    }

    // Fallback: Find by sessionId or Create
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, sessionId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isPrimary: true }, take: 1 },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  };

  getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string || req.cookies?.sessionId;

      if (!userId && !sessionId) {
        return res.json({
          success: true,
          data: { items: [], subtotal: 0, shipping: 0, total: 0 },
        });
      }

      const cart = await this.getOrCreateCart(userId, sessionId);

      const items = cart.items.map(item => ({
        id: item.id,
        variantId: item.variantId,
        productId: item.variant.productId,
        name: item.variant.product.name,
        size: item.variant.size,
        color: item.variant.color,
        price: Number(item.variant.product.basePrice) + Number(item.variant.priceAdjustment),
        quantity: item.quantity,
        image: item.variant.product.images[0]?.url || '',
        stockQuantity: item.variant.stockQuantity,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 500 ? 0 : 25;
      const total = subtotal + shipping;

      res.json({
        success: true,
        data: { items, subtotal, shipping, total },
      });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { variantId, quantity } = addItemSchema.parse(req.body);
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string || `session-${Date.now()}`;

      // Verify variant exists and has stock
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new AppError(404, 'Product variant not found');
      }

      if (variant.stockQuantity < quantity) {
        throw new AppError(400, 'Not enough stock available');
      }

      const cart = await this.getOrCreateCart(userId, sessionId);

      // Check if item already in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, variantId },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, variantId, quantity },
        });
      }

      // Return updated cart
      return this.getCart(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const { quantity } = updateItemSchema.parse(req.body);

      const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { variant: true },
      });

      if (!item) {
        throw new AppError(404, 'Cart item not found');
      }

      if (quantity === 0) {
        await prisma.cartItem.delete({ where: { id: itemId } });
      } else {
        if (item.variant.stockQuantity < quantity) {
          throw new AppError(400, 'Not enough stock available');
        }

        await prisma.cartItem.update({
          where: { id: itemId },
          data: { quantity },
        });
      }

      // Return updated cart
      return this.getCart(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;

      await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {
        throw new AppError(404, 'Cart item not found');
      });

      // Return updated cart
      return this.getCart(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, 'Authentication required');
      }

      const cart = await prisma.cart.findFirst({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      res.json({
        success: true,
        data: { items: [], subtotal: 0, shipping: 0, total: 0 },
      });
    } catch (error) {
      next(error);
    }
  };
}

