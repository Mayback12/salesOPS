export const Category = {
  TOPS: 'TOPS',
  BOTTOMS: 'BOTTOMS',
  DRESSES: 'DRESSES',
  SHOES: 'SHOES',
  ACCESSORIES: 'ACCESSORIES',
  OUTERWEAR: 'OUTERWEAR',
  UNDERWEAR: 'UNDERWEAR',
  SPORTSWEAR: 'SPORTSWEAR',
  OTHER: 'OTHER',
} as const;

export type Category = string;

export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT = 'CREDIT',
}

export enum SaleStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export enum DebtStatus {
  OUTSTANDING = 'OUTSTANDING',
  PARTIAL = 'PARTIAL',
  SETTLED = 'SETTLED',
}

export enum ExpenseCategory {
  RESTOCK = 'RESTOCK',
  TRANSPORT = 'TRANSPORT',
  RENT = 'RENT',
  MARKETING = 'MARKETING',
  PACKAGING = 'PACKAGING',
  OTHER = 'OTHER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string | null;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  sku?: string | null;
  category: string;
  description?: string | null;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockAlert: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  userId: string;
  customerId?: string | null;
  saleNumber: string;
  totalAmount: number;
  amountPaid: number;
  balanceOwed: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string | null;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Debt {
  id: string;
  userId: string;
  customerId: string;
  saleId?: string | null;
  originalAmount: number;
  amountPaid: number;
  balance: number;
  dueDate?: Date | null;
  status: DebtStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string | null;
  expenseDate: Date;
  createdAt: Date;
}
