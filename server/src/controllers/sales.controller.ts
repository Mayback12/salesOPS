import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { format, startOfDay, endOfDay } from 'date-fns';

const generateSaleNumber = async (userId: string, date: Date): Promise<string> => {
  const dateStr = format(date, 'yyyyMMdd');
  const count = await prisma.sale.count({
    where: {
      userId,
      saleDate: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });
  return `SLS-${dateStr}-${String(count + 1).padStart(4, '0')}`;
};

export const getSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, status, customerId, paymentMethod } = req.query;

    const where: any = {
      userId: req.user.id,
    };

    if (from || to) {
      where.saleDate = {};
      if (from) where.saleDate.gte = new Date(from as string);
      if (to) where.saleDate.lte = new Date(to as string);
    }

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
        debt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: sales.length,
      data: { sales },
    });
  } catch (err) {
    next(err);
  }
};

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      customerId,
      items, // Array of { productId, quantity, unitPrice }
      amountPaid,
      paymentMethod,
      notes,
      saleDate,
    } = req.body;

    if (!items || items.length === 0) {
      return next(new AppError('A sale must have at least one item', 400));
    }

    const date = saleDate ? new Date(saleDate) : new Date();
    const saleNumber = await generateSaleNumber(req.user.id, date);

    // Start transaction
    const result = await prisma.$transaction(async (tx: any) => {
      let totalAmount = 0;
      const saleItemsData = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, userId: req.user.id },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stockQty < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const subtotal = Number(item.unitPrice) * item.quantity;
        totalAmount += subtotal;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          costPrice: product.costPrice,
          subtotal,
        });

        // Update stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.quantity } },
        });
      }

      const balanceOwed = totalAmount - (amountPaid || 0);
      const status = balanceOwed > 0 ? 'PARTIAL' : 'COMPLETED';

      const sale = await tx.sale.create({
        data: {
          userId: req.user.id,
          customerId,
          saleNumber,
          totalAmount,
          amountPaid: amountPaid || 0,
          balanceOwed,
          paymentMethod,
          status: status as any,
          notes,
          saleDate: date,
          items: {
            create: saleItemsData,
          },
        },
        include: { items: true },
      });

      // Handle debt if balance owed
      if (balanceOwed > 0) {
        if (!customerId) {
          throw new Error('A customer must be selected for sales with balance owed (credit)');
        }

        await tx.debt.create({
          data: {
            userId: req.user.id,
            customerId,
            saleId: sale.id,
            originalAmount: balanceOwed,
            balance: balanceOwed,
            status: 'OUTSTANDING',
          },
        });
      }

      // Update customer total spent
      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: { totalSpent: { increment: totalAmount } },
        });
      }

      return sale;
    });

    res.status(201).json({
      status: 'success',
      data: { sale: result },
    });
  } catch (err: any) {
    if (err.message.includes('not found') || err.message.includes('Insufficient stock') || err.message.includes('customer must be selected')) {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

export const getSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = await prisma.sale.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        customer: true,
        items: { include: { product: true } },
        debt: true,
      },
    });

    if (!sale) {
      return next(new AppError('Sale not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { sale },
    });
  } catch (err) {
    next(err);
  }
};

export const cancelSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = await prisma.sale.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });

    if (!sale) {
      return next(new AppError('Sale not found', 404));
    }

    if (sale.status === 'CANCELLED') {
      return next(new AppError('Sale is already cancelled', 400));
    }

    await prisma.$transaction(async (tx: any) => {
      // Restore stock
      for (const item of sale.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { increment: item.quantity } },
        });
      }

      // Cancel debt if exists
      await tx.debt.updateMany({
        where: { saleId: sale.id },
        data: { status: 'SETTLED', balance: 0, notes: 'Sale cancelled' },
      });

      // Update sale status
      await tx.sale.update({
        where: { id: sale.id },
        data: { status: 'CANCELLED' },
      });

      // Update customer total spent
      if (sale.customerId) {
        await tx.customer.update({
          where: { id: sale.customerId },
          data: { totalSpent: { decrement: sale.totalAmount } },
        });
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Sale cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};
