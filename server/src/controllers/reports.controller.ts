import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfTodayVal = endOfDay(today);

    // Today's Revenue
    const todaySales = await prisma.sale.aggregate({
      where: { userId: req.user.id, saleDate: { gte: startOfToday, lte: endOfTodayVal }, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // Today's Profit (Selling Price - Cost Price)
    const todayItems = await prisma.saleItem.findMany({
      where: { sale: { userId: req.user.id, saleDate: { gte: startOfToday, lte: endOfTodayVal }, status: { not: 'CANCELLED' } } },
      select: { subtotal: true, costPrice: true, quantity: true },
    });

    const todayProfit = todayItems.reduce((acc: number, item: any) => acc + (Number(item.subtotal) - (Number(item.costPrice) * item.quantity)), 0);

    // Outstanding Debts
    const totalDebt = await prisma.debt.aggregate({
      where: { userId: req.user.id, status: { not: 'SETTLED' } },
      _sum: { balance: true },
    });

    // Low Stock Count
    const products = await prisma.product.findMany({
      where: { userId: req.user.id, isActive: true },
    });
    const lowStockCount = products.filter((p: any) => p.stockQty <= p.lowStockAlert).length;

    res.status(200).json({
      status: 'success',
      data: {
        todayRevenue: Number(todaySales._sum.totalAmount) || 0,
        todayProfit,
        salesCount: todaySales._count.id,
        outstandingDebt: Number(totalDebt._sum.balance) || 0,
        lowStockCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDailyRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = 7;
    const startDate = startOfDay(subDays(new Date(), days - 1));

    const sales = await prisma.sale.findMany({
      where: { userId: req.user.id, saleDate: { gte: startDate }, status: { not: 'CANCELLED' } },
      select: { totalAmount: true, saleDate: true },
    });

    // Group by day (simplified)
    const chartData = Array.from({ length: days }).map((_, i) => {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'MMM dd');
      const dailyTotal = sales
        .filter((s: any) => isSameDay(new Date(s.saleDate), date))
        .reduce((acc: number, s: any) => acc + Number(s.totalAmount), 0);
      return { date: dateStr, revenue: dailyTotal };
    });

    res.status(200).json({ status: 'success', data: chartData });
  } catch (err) {
    next(err);
  }
};
// Helper imports needed for logic above
import { addDays, isSameDay, format } from 'date-fns';

export const getBusinessReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const from = req.query.from ? startOfDay(new Date(req.query.from as string)) : startOfDay(subDays(new Date(), 29));
    const to = req.query.to ? endOfDay(new Date(req.query.to as string)) : endOfDay(new Date());

    const sales = await prisma.sale.findMany({
      where: { userId: req.user.id, saleDate: { gte: from, lte: to }, status: { not: 'CANCELLED' } },
      include: {
        customer: { select: { name: true } },
        items: { include: { product: { select: { name: true, category: true } } } },
      },
      orderBy: { saleDate: 'desc' },
    });

    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id, expenseDate: { gte: from, lte: to } },
      orderBy: { expenseDate: 'desc' },
    });

    const products = await prisma.product.findMany({
      where: { userId: req.user.id, isActive: true },
      orderBy: { name: 'asc' },
    });

    const balances = await prisma.debt.findMany({
      where: { userId: req.user.id, status: { not: 'SETTLED' } },
      include: { customer: { select: { name: true, phone: true } }, sale: { select: { saleNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.totalAmount), 0);
    const totalPaid = sales.reduce((sum: number, sale: any) => sum + Number(sale.amountPaid), 0);
    const totalBalance = sales.reduce((sum: number, sale: any) => sum + Number(sale.balanceOwed), 0);
    const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);
    const grossProfit = sales.reduce((sum: number, sale: any) => {
      const saleProfit = sale.items.reduce((itemSum: number, item: any) => {
        return itemSum + (Number(item.subtotal) - Number(item.costPrice) * item.quantity);
      }, 0);
      return sum + saleProfit;
    }, 0);

    const topProductsMap = new Map<string, any>();
    sales.forEach((sale: any) => {
      sale.items.forEach((item: any) => {
        const current = topProductsMap.get(item.productId) || {
          productId: item.productId,
          name: item.product?.name || 'Product',
          category: item.product?.category || 'OTHER',
          quantity: 0,
          revenue: 0,
        };
        current.quantity += item.quantity;
        current.revenue += Number(item.subtotal);
        topProductsMap.set(item.productId, current);
      });
    });

    const daily = Array.from({ length: Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1) }).map((_, index) => {
      const date = addDays(from, index);
      const daySales = sales.filter((sale: any) => isSameDay(new Date(sale.saleDate), date));
      const dayExpenses = expenses.filter((expense: any) => isSameDay(new Date(expense.expenseDate), date));
      return {
        date: format(date, 'MMM dd'),
        revenue: daySales.reduce((sum: number, sale: any) => sum + Number(sale.totalAmount), 0),
        expenses: dayExpenses.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0),
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        range: { from, to },
        summary: {
          totalRevenue,
          totalPaid,
          totalBalance,
          totalExpenses,
          grossProfit,
          netProfit: grossProfit - totalExpenses,
          salesCount: sales.length,
          lowStockCount: products.filter((product: any) => product.stockQty <= product.lowStockAlert).length,
        },
        daily,
        sales: sales.map((sale: any) => ({
          id: sale.id,
          saleNumber: sale.saleNumber,
          customer: sale.customer?.name || 'Walk-in',
          date: sale.saleDate,
          totalAmount: Number(sale.totalAmount),
          amountPaid: Number(sale.amountPaid),
          balanceOwed: Number(sale.balanceOwed),
          status: sale.status,
        })),
        topProducts: Array.from(topProductsMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
        inventory: products.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          stockQty: product.stockQty,
          lowStockAlert: product.lowStockAlert,
          sellingPrice: Number(product.sellingPrice),
          costPrice: Number(product.costPrice),
          stockValue: Number(product.costPrice) * product.stockQty,
          lowStock: product.stockQty <= product.lowStockAlert,
        })),
        balances: balances.map((balance: any) => ({
          id: balance.id,
          customer: balance.customer.name,
          phone: balance.customer.phone,
          saleNumber: balance.sale?.saleNumber || 'Manual Balance',
          balance: Number(balance.balance),
          status: balance.status,
        })),
        expenses: expenses.map((expense: any) => ({
          id: expense.id,
          title: expense.title,
          category: expense.category,
          amount: Number(expense.amount),
          date: expense.expenseDate,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
