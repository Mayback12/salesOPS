import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hasDebt } = req.query;
    const where: any = { userId: req.user.id };

    if (hasDebt === 'true') {
      where.debts = { some: { status: { not: 'SETTLED' } } };
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      results: customers.length,
      data: { customers },
    });
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.create({
      data: { ...req.body, userId: req.user.id },
    });

    res.status(201).json({
      status: 'success',
      data: { customer },
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        sales: { orderBy: { saleDate: 'desc' }, take: 10 },
        debts: { include: { payments: true } },
      },
    });

    if (!customer) return next(new AppError('Customer not found', 404));

    res.status(200).json({ status: 'success', data: { customer } });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: req.body,
    });

    if (customer.count === 0) return next(new AppError('Customer not found', 404));

    const updatedCustomer = await prisma.customer.findUnique({ where: { id: req.params.id } });
    res.status(200).json({ status: 'success', data: { customer: updatedCustomer } });
  } catch (err) {
    next(err);
  }
};
