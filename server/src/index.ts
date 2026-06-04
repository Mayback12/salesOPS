import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import salesRoutes from './routes/sales.routes';
import customerRoutes from './routes/customers.routes';
import debtRoutes from './routes/debts.routes';
import expenseRoutes from './routes/expenses.routes';
import reportRoutes from './routes/reports.routes';
import categoryRoutes from './routes/categories.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/debts', debtRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Serve static files from the React app
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
