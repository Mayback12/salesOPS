import { Request, Response, NextFunction } from 'express';
import { productsService } from '../services/products.service';
import { AppError } from '../middleware/errorHandler';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, lowStock } = req.query;
    const where: any = {};
    if (category) where.category = category;

    const products = await productsService.getAll(req.user.id, where);
    
    let filteredProducts = products;
    if (lowStock === 'true') {
      filteredProducts = products.filter((p: any) => p.stockQty <= p.lowStockAlert);
    }

    res.status(200).json({
      status: 'success',
      results: filteredProducts.length,
      data: { products: filteredProducts },
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.create(req.body, req.user.id);
    res.status(201).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.getById(req.params.id, req.user.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productsService.update(req.params.id, req.body, req.user.id);
    if (result.count === 0) return next(new AppError('Product not found', 404));
    const updatedProduct = await productsService.getById(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data: { product: updatedProduct } });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productsService.update(req.params.id, { isActive: false }, req.user.id);
    if (result.count === 0) return next(new AppError('Product not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

export const restockProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) return next(new AppError('Please provide a valid quantity', 400));

    const product = await productsService.getById(req.params.id, req.user.id);
    if (!product) return next(new AppError('Product not found', 404));

    const updatedProduct = await productsService.restock(req.params.id, quantity, req.user.id);
    res.status(200).json({ status: 'success', data: { product: updatedProduct } });
  } catch (err) {
    next(err);
  }
};
