import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getDebts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, overdue } = req.query;
    const where: any = { userId: req.user.id };

    if (status) where.status = status;
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'SETTLED' };
    }

    const debts = await prisma.debt.findMany({
      where,
      include: { customer: { select: { name: true } }, sale: { select: { saleNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', results: debts.length, data: { debts } });
  } catch (err) {
    next(err);
  }
};

export const recordPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, notes, paidAt } = req.body;
    const debt = await prisma.debt.findFirst({ where: { id: req.params.id, userId: req.user.id } });

    if (!debt) return next(new AppError('Debt not found', 404));
    if (amount > debt.balance) return next(new AppError('Payment amount exceeds balance', 400));

    const result = await prisma.$transaction(async (tx: any) => {
      const payment = await tx.debtPayment.create({
        data: { debtId: debt.id, amount, notes, paidAt: paidAt ? new Date(paidAt) : new Date() },
      });

      const newBalance = Number(debt.balance) - amount;
      const newStatus = newBalance === 0 ? 'SETTLED' : 'PARTIAL';

      const updatedDebt = await tx.debt.update({
        where: { id: debt.id },
        data: { amountPaid: { increment: amount }, balance: newBalance, status: newStatus as any },
      });

      if (debt.saleId) {
        await tx.sale.update({
          where: { id: debt.saleId },
          data: {
            amountPaid: { increment: amount },
            balanceOwed: newBalance,
            status: newBalance === 0 ? 'COMPLETED' : 'PARTIAL',
          },
        });
      }

      return { payment, updatedDebt };
    });

    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};
