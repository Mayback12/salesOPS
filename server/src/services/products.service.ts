import { prisma } from '../lib/prisma';

export const productsService = {
  getAll: (userId: string, where: any) => prisma.product.findMany({
    where: { ...where, userId, isActive: true },
    orderBy: { createdAt: 'desc' },
  }),
  getById: (id: string, userId: string) => prisma.product.findFirst({
    where: { id, userId, isActive: true },
  }),
  create: async (data: any, userId: string) => {
    const category = String(data.category || 'OTHER').trim().toUpperCase();
    await prisma.productCategory.upsert({
      where: { userId_name: { userId, name: category } },
      create: { userId, name: category },
      update: {},
    });

    return prisma.product.create({
      data: { ...data, category, userId },
    });
  },
  update: (id: string, data: any, userId: string) => prisma.product.updateMany({
    where: { id, userId },
    data,
  }),
  restock: (id: string, quantity: number, userId: string) => prisma.product.update({
    where: { id }, // Note: userId check should be done before calling this or added to where if supported by update
    data: { stockQty: { increment: quantity } },
  }),
};
