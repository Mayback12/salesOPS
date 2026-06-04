import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const normalizeExpenseData = (data: any) => ({
  ...data,
  expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
});

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, from, to } = req.query;
    const where: any = { userId: req.user.id };

    if (category) where.category = category;
    if (from || to) {
      where.expenseDate = {};
      if (from) where.expenseDate.gte = new Date(from as string);
      if (to) where.expenseDate.lte = new Date(to as string);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
    });

    res.status(200).json({ status: 'success', results: expenses.length, data: { expenses } });
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await prisma.expense.create({
      data: { ...normalizeExpenseData(req.body), userId: req.user.id },
    });

    res.status(201).json({ status: 'success', data: { expense } });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await prisma.expense.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: normalizeExpenseData(req.body),
    });

    if (expense.count === 0) return next(new AppError('Expense not found', 404));

    const updatedExpense = await prisma.expense.findUnique({ where: { id: req.params.id } });
    res.status(200).json({ status: 'success', data: { expense: updatedExpense } });
  } catch (err) {
    next(err);
  }
};
