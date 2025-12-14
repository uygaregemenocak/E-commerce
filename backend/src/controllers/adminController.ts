import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../types';

export class AdminController {
    getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const [
                totalOrders,
                totalRevenue,
                totalCustomers,
                totalProducts,
                lowStockProducts,
                recentOrders
            ] = await Promise.all([
                prisma.order.count(),
                prisma.order.aggregate({
                    _sum: { total: true }
                }),
                prisma.user.count({ where: { role: 'customer' } }),
                prisma.product.count({ where: { isActive: true } }),
                prisma.productVariant.count({ where: { stockQuantity: { lt: 5 } } }),
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: { user: { select: { name: true } } }
                })
            ]);

            // 1. Orders This Week
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const ordersLastWeek = await prisma.order.groupBy({
                by: ['createdAt'],
                where: { createdAt: { gte: sevenDaysAgo } },
            });

            // Transform to { date: 'Mon', orders: 12 }
            const ordersData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
                const count = ordersLastWeek.filter((o: any) =>
                    new Date(o.createdAt).toDateString() === date.toDateString()
                ).length;
                ordersData.push({ date: dayStr, orders: count });
            }

            // 2. Best Selling Products (Top 5)
            const topItems = await prisma.orderItem.groupBy({
                by: ['variantId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            });

            // Need to fetch details for these variants
            const productsData = await Promise.all(topItems.map(async (item: any) => {
                const variant = await prisma.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: { product: true }
                });
                return {
                    name: variant?.product.name || 'Unknown',
                    sales: item._sum.quantity || 0
                };
            }));

            // 3. Sales by Category
            // For simplicity, we'll count products per category as a proxy or just list categories for now
            // A real aggregation would be complex. Let's show Category Distribution of current stock/products.
            const categories = await prisma.category.findMany({
                include: { products: true }
            });

            const categoryData = categories.slice(0, 5).map((cat: any, index: number) => ({
                name: cat.name,
                value: cat.products.length,
                color: ['#000000', '#404040', '#808080', '#D4AF37', '#A0A0A0'][index % 5]
            }));

            res.json({
                success: true,
                data: {
                    kpi: {
                        orders: totalOrders,
                        revenue: Number(totalRevenue._sum.total || 0),
                        customers: totalCustomers,
                        products: totalProducts,
                        lowStock: lowStockProducts
                    },
                    recentOrders: recentOrders.map((o: any) => ({
                        id: o.orderNumber,
                        customer: o.user.name,
                        total: Number(o.total),
                        status: o.status,
                        date: o.createdAt.toLocaleDateString()
                    })),
                    charts: {
                        ordersData,
                        productsData,
                        categoryData
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    };
}
