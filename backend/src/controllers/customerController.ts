import { Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
  membershipLevel: z.string().optional(),
});

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  membershipLevel: z.string().optional(),
  isActive: z.boolean().optional(),
});

export class CustomerController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { search, status, page = '1', limit = '20' } = req.query;
      
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;
      const skip = (pageNum - 1) * limitNum;

      const where: any = { role: 'customer' };
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
          { memberId: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      
      if (status === 'active') where.isActive = true;
      if (status === 'inactive') where.isActive = false;

      const [customers, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            memberId: true,
            membershipLevel: true,
            isActive: true,
            createdAt: true,
            _count: { select: { orders: true } },
            orders: {
              select: { total: true },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      const formattedCustomers = customers.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        phone: c.phone,
        memberId: c.memberId,
        membershipLevel: c.membershipLevel,
        isActive: c.isActive,
        createdAt: c.createdAt,
        totalOrders: c._count.orders,
        totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
      }));

      res.json({
        success: true,
        data: formattedCustomers,
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

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const customer = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          memberId: true,
          membershipLevel: true,
          isActive: true,
          createdAt: true,
          addresses: true,
          orders: {
            include: {
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
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!customer) {
        throw new AppError(404, 'Customer not found');
      }

      const totalSpent = customer.orders.reduce((sum, o) => sum + Number((o as any).total || 0), 0);

      res.json({
        success: true,
        data: {
          ...customer,
          totalOrders: customer.orders.length,
          totalSpent,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, phone, membershipLevel } = createCustomerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const memberId = `AMR-CUST-${Date.now().toString(36).toUpperCase()}`;

      const customer = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          phone,
          memberId,
          membershipLevel: membershipLevel || 'Standard',
          role: 'customer',
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          memberId: true,
          membershipLevel: true,
          isActive: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateCustomerSchema.parse(req.body);

      const customer = await prisma.user.findUnique({ where: { id } });
      if (!customer) {
        throw new AppError(404, 'Customer not found');
      }

      const updated = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          memberId: true,
          membershipLevel: true,
          isActive: true,
          createdAt: true,
        },
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

