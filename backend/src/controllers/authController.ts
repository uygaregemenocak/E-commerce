import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { UserRole } from '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, phone } = registerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const memberId = `AMR-CUST-${Date.now().toString(36).toUpperCase()}`;

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          phone,
          memberId,
          role: 'customer',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          memberId: true,
          membershipLevel: true,
        },
      });

      const payload = { userId: user.id, email: user.email, role: user.role as UserRole };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          name: true,
          role: true,
          memberId: true,
          membershipLevel: true,
          isActive: true,
        },
      });

      if (!user) {
        throw new AppError(401, 'Invalid email or password');
      }

      if (!user.isActive) {
        throw new AppError(403, 'Account is deactivated');
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError(401, 'Invalid email or password');
      }

      const payload = { userId: user.id, email: user.email, role: user.role as UserRole };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            memberId: user.memberId,
            membershipLevel: user.membershipLevel,
          },
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AppError(401, 'Refresh token required');
      }

      const payload = verifyRefreshToken(refreshToken);
      
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new AppError(401, 'User not found or deactivated');
      }

      const newPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
      const accessToken = generateAccessToken(newPayload);

      res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };
}

