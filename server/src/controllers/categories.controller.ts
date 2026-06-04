import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = String(req.body.name || '').trim().toUpperCase();
    if (!name) return next(new AppError('Category name is required', 400));

    const category = await prisma.productCategory.upsert({
      where: { userId_name: { userId: req.user.id, name } },
      create: { userId: req.user.id, name },
      update: {},
    });

    res.status(201).json({
      status: 'success',
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};
