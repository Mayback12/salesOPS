import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

const getAdminCredentials = () => ({
  email: process.env.ADMIN_EMAIL || 'admin@salesops.com',
  password: process.env.ADMIN_PASSWORD || 'password123',
});

// Auto-ensure the admin user exists in the DB
const ensureAdminUser = async () => {
  const { email, password } = getAdminCredentials();
  
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        password: hashedPassword,
        businessName: 'SalesOps Business',
      },
    });
    console.log('Admin user created');
  }
  return user;
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const adminCredentials = getAdminCredentials();

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Only allow the admin defined in .env
    if (email !== adminCredentials.email) {
      return next(new AppError('Unauthorized access', 401));
    }

    const user = await ensureAdminUser();

    if (!(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...user } = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
