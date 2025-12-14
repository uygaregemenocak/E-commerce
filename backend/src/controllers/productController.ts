import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  brand: z.string().optional().default('AMOR'),
  categoryId: z.string(),
  description: z.string(),
  fabric: z.string().optional(),
  care: z.string().optional(),
  basePrice: z.number().positive(),
  variants: z.array(z.object({
    size: z.string(),
    color: z.string(),
    colorHex: z.string().optional(),
    stockQuantity: z.number().int().min(0).default(0),
    priceAdjustment: z.number().default(0),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
});

const updateProductSchema = createProductSchema.partial();

export class ProductController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, search, minPrice, maxPrice, page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;
      const skip = (pageNum - 1) * limitNum;

      const where: any = { isActive: true };

      if (category) {
        where.category = { slug: category };
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { sku: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = parseFloat(minPrice as string);
        if (maxPrice) where.basePrice.lte = parseFloat(maxPrice as string);
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        success: true,
        data: products,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
            { sku: id },
          ],
        },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          reviews: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      // Fetch related products (same category, different id)
      const relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 4,
      });

      res.json({
        success: true,
        data: { ...product, relatedProducts },
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = createProductSchema.parse(req.body);
      const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const product = await prisma.product.create({
        data: {
          name: data.name,
          sku: data.sku,
          slug,
          brand: data.brand,
          categoryId: data.categoryId,
          description: data.description,
          fabric: data.fabric,
          care: data.care,
          basePrice: data.basePrice,
          variants: data.variants ? { create: data.variants } : undefined,
          images: data.images ? { create: data.images.map((img, i) => ({ ...img, sortOrder: i })) } : undefined,
        },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateProductSchema.parse(req.body);

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        throw new AppError(404, 'Product not found');
      }

      const updateData: any = { ...data };
      if (data.name) {
        updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      delete updateData.variants;
      delete updateData.images;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      // Soft delete - just mark as inactive
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Product deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  addReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { rating, comment } = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }).parse(req.body);

      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, 'Authentication required');
      }

      // Check if product exists
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      // Verify user has purchased this product
      // In a real app we'd uncomment this, but for demo we can allow reviews
      /*
      const hasPurchased = await prisma.orderItem.findFirst({
        where: {
          order: { userId, status: 'paid' },
          variant: { productId: id }
        }
      });
      if (!hasPurchased) {
        throw new AppError(403, 'You must purchase this product to review it');
      }
      */

      const review = await prisma.review.create({
        data: {
          productId: id,
          userId,
          rating,
          comment,
        },
        include: {
          user: { select: { name: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };
}
