# ClothTrack — Master Agentic AI Build Prompt

> **Purpose:** This document is a complete master prompt for an agentic AI to plan, scaffold, and build the ClothTrack application from scratch. It covers every feature, every function, data models, API routes, UI screens, and technical specifications. Follow this document top to bottom.

---

## 1. Project Overview

Build **ClothTrack** — a full-stack clothing sales management web application for a small/solo clothing seller. The app replaces manual book-keeping with a fast, modern digital system that tracks sales, inventory, customers, debts, expenses, and generates reports.

### Goals
- Replace physical sales record books with a digital system
- Give the seller a real-time view of daily, weekly, and monthly performance
- Track inventory so the seller knows what to restock
- Track customers who owe money (credit/debt)
- Generate printable/exportable sales reports

---

## 2. Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 with TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 (SPA, client-side routing) |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) v5 |
| Forms | React Hook Form + Zod validation |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Date Handling | date-fns |
| Toast Notifications | react-hot-toast |
| Icons | Lucide React |
| PDF Export | jsPDF + jspdf-autotable |
| Excel Export | xlsx (SheetJS) |

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js with TypeScript |
| Database | PostgreSQL 15+ |
| ORM | Prisma |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| File Uploads | Multer |
| Environment | dotenv |
| CORS | cors middleware |
| Rate Limiting | express-rate-limit |

### Dev & Tooling
- **Monorepo structure** — `/client` (Vite React app) and `/server` (Express API)
- **Shared types** — `/shared/types.ts` shared between client and server
- ESLint + Prettier on both sides
- `.env` files for environment variables

---

## 3. Project File Structure

```
clothtrack/
├── client/                          # Vite + React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios API call functions
│   │   │   ├── auth.ts
│   │   │   ├── sales.ts
│   │   │   ├── products.ts
│   │   │   ├── customers.ts
│   │   │   ├── expenses.ts
│   │   │   └── reports.ts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   └── AppLayout.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   ├── sales/
│   │   │   │   ├── SaleForm.tsx
│   │   │   │   ├── SaleCard.tsx
│   │   │   │   └── SaleItemRow.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   └── StockBadge.tsx
│   │   │   ├── customers/
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   └── DebtBadge.tsx
│   │   │   └── charts/
│   │   │       ├── SalesLineChart.tsx
│   │   │       ├── CategoryPieChart.tsx
│   │   │       └── ProfitBarChart.tsx
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── sales/
│   │   │   │   ├── SalesPage.tsx
│   │   │   │   └── NewSalePage.tsx
│   │   │   ├── inventory/
│   │   │   │   └── InventoryPage.tsx
│   │   │   ├── customers/
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   └── CustomerDetailPage.tsx
│   │   │   ├── debts/
│   │   │   │   └── DebtsPage.tsx
│   │   │   ├── expenses/
│   │   │   │   └── ExpensesPage.tsx
│   │   │   └── reports/
│   │   │       └── ReportsPage.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSales.ts
│   │   │   ├── useInventory.ts
│   │   │   └── useDebts.ts
│   │   ├── stores/                  # Zustand global stores
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── lib/
│   │   │   ├── axios.ts             # Axios instance with interceptors
│   │   │   └── utils.ts             # Formatting helpers (currency, date, etc.)
│   │   ├── types/                   # Frontend-only TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx                  # Router setup
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── server/                          # Express + Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── sales.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── customers.routes.ts
│   │   │   ├── expenses.routes.ts
│   │   │   ├── debts.routes.ts
│   │   │   └── reports.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── sales.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── customers.controller.ts
│   │   │   ├── expenses.controller.ts
│   │   │   ├── debts.controller.ts
│   │   │   └── reports.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── validate.middleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── lib/
│   │   │   └── prisma.ts            # Prisma client singleton
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── index.ts                 # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types.ts                     # Types shared by client and server
│
└── README.md
```

---

## 4. Database Schema (Prisma)

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  password     String
  businessName String?
  currency     String    @default("GHS")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  products     Product[]
  sales        Sale[]
  customers    Customer[]
  expenses     Expense[]
}

model Product {
  id           String      @id @default(cuid())
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  name         String
  sku          String?
  category     Category
  description  String?
  costPrice    Decimal     @db.Decimal(10, 2)
  sellingPrice Decimal     @db.Decimal(10, 2)
  stockQty     Int         @default(0)
  lowStockAlert Int        @default(5)
  imageUrl     String?
  isActive     Boolean     @default(true)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  saleItems    SaleItem[]

  @@index([userId])
}

enum Category {
  TOPS
  BOTTOMS
  DRESSES
  SHOES
  ACCESSORIES
  OUTERWEAR
  UNDERWEAR
  SPORTSWEAR
  OTHER
}

model Sale {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  customerId    String?
  customer      Customer?   @relation(fields: [customerId], references: [id])
  saleNumber    String      @unique
  totalAmount   Decimal     @db.Decimal(10, 2)
  amountPaid    Decimal     @db.Decimal(10, 2)
  balanceOwed   Decimal     @db.Decimal(10, 2) @default(0)
  paymentMethod PaymentMethod
  status        SaleStatus  @default(COMPLETED)
  notes         String?
  saleDate      DateTime    @default(now())
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  items         SaleItem[]
  debt          Debt?

  @@index([userId, saleDate])
}

model SaleItem {
  id          String   @id @default(cuid())
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  costPrice   Decimal  @db.Decimal(10, 2)
  subtotal    Decimal  @db.Decimal(10, 2)
}

enum PaymentMethod {
  CASH
  MOBILE_MONEY
  BANK_TRANSFER
  CREDIT
}

enum SaleStatus {
  COMPLETED
  PARTIAL
  CANCELLED
}

model Customer {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  phone       String?
  email       String?
  address     String?
  notes       String?
  totalSpent  Decimal  @db.Decimal(10, 2) @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  sales       Sale[]
  debts       Debt[]

  @@index([userId])
}

model Debt {
  id           String     @id @default(cuid())
  userId       String
  customerId   String
  customer     Customer   @relation(fields: [customerId], references: [id])
  saleId       String?    @unique
  sale         Sale?      @relation(fields: [saleId], references: [id])
  originalAmount Decimal  @db.Decimal(10, 2)
  amountPaid   Decimal    @db.Decimal(10, 2) @default(0)
  balance      Decimal    @db.Decimal(10, 2)
  dueDate      DateTime?
  status       DebtStatus @default(OUTSTANDING)
  notes        String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  payments     DebtPayment[]

  @@index([userId, status])
}

enum DebtStatus {
  OUTSTANDING
  PARTIAL
  SETTLED
}

model DebtPayment {
  id        String   @id @default(cuid())
  debtId    String
  debt      Debt     @relation(fields: [debtId], references: [id])
  amount    Decimal  @db.Decimal(10, 2)
  paidAt    DateTime @default(now())
  notes     String?
}

model Expense {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id])
  title       String
  amount      Decimal         @db.Decimal(10, 2)
  category    ExpenseCategory
  description String?
  expenseDate DateTime        @default(now())
  createdAt   DateTime        @default(now())

  @@index([userId, expenseDate])
}

enum ExpenseCategory {
  RESTOCK
  TRANSPORT
  RENT
  MARKETING
  PACKAGING
  OTHER
}
```

---

## 5. Full Feature List

### 5.1 Authentication
| Feature | Description |
|---------|-------------|
| Register | Create account with name, email, password, business name |
| Login | Email + password, returns JWT token |
| Auth guard | All routes protected, redirect to login if no valid token |
| Persistent session | Token stored in localStorage, Axios interceptor attaches it |
| Logout | Clear token and redirect to login |
| Profile settings | Update name, business name, currency preference |

---

### 5.2 Dashboard (Home Page)
The main landing page after login. Shows a full overview of the business at a glance.

#### Stat Cards (top row)
| Card | Calculation |
|------|-------------|
| Today's Revenue | Sum of `totalAmount` for all sales today |
| Today's Profit | Sum of `(sellingPrice - costPrice) × qty` for today's sales |
| Sales Count Today | Count of sales records for today |
| Outstanding Debts | Sum of all `Debt.balance` where status != SETTLED |

#### Charts Section
| Chart | Type | Data |
|-------|------|------|
| Revenue this week | Line chart (Recharts) | Daily revenue for last 7 days |
| Sales by category | Pie chart (Recharts) | Sum of sales per product category |
| Revenue vs Expenses | Bar chart (Recharts) | Last 6 months comparison |

#### Widgets
- **Low stock alert panel** — Products where `stockQty <= lowStockAlert`, with product name, category, and current qty
- **Recent sales feed** — Last 5 sales with customer name (or "Walk-in"), total, payment method, and time
- **Top debtors** — Top 5 customers with highest outstanding debt balance

---

### 5.3 Sales Management

#### Sales List Page (`/sales`)
- Table of all sales, sortable by date, amount, status
- Filter by: date range, payment method, status, customer
- Search by sale number or customer name
- Quick summary totals for filtered results (total revenue, total profit)
- Click a row to view sale detail
- Button: "Record New Sale"

#### New Sale Page (`/sales/new`)
This is the core daily-use screen. Must be fast and intuitive.

**Step 1 — Add items**
- Product search/select (searchable dropdown, filters by name or SKU)
- After selecting a product, show: name, current price, available stock
- Input quantity (validate against available stock)
- Add to sale items list
- Items table shows: product name, qty, unit price, subtotal
- Can remove items from list
- Running total updates live at the bottom

**Step 2 — Customer & Payment**
- Customer field: searchable, can select existing customer OR type "Walk-in"
- If a known customer is selected, show their total spent and any existing debt
- Total amount (auto-calculated, read-only)
- Amount paid input (can be less than total — triggers credit/debt creation)
- Balance owed (auto-calculated: total - amount paid)
- Payment method selector: Cash, Mobile Money, Bank Transfer, Credit
- Optional notes field
- Sale date (defaults to today, can change for back-dating)

**Step 3 — Confirm & Save**
- Summary review before submitting
- On save:
    - Create `Sale` record
    - Create `SaleItem` records
    - Decrement `Product.stockQty` for each item
    - If `balanceOwed > 0`, create `Debt` record linked to the sale and customer
    - Update `Customer.totalSpent`
    - Generate a unique `saleNumber` (e.g., `CLT-20240601-0042`)
    - Show success toast with option to "View Receipt" or "Record Another Sale"

#### Receipt View
- Printable receipt layout showing:
    - Business name, date, sale number
    - Items table (name, qty, unit price, subtotal)
    - Total, amount paid, balance owed
    - Payment method
    - Thank you message
- Print button + optional WhatsApp share button (opens `wa.me` link with pre-filled text)

---

### 5.4 Inventory Management (`/inventory`)

#### Product List
- Grid or table view toggle
- Filter by: category, low stock, all
- Search by name or SKU
- Each product card/row shows: image (if any), name, category, selling price, cost price, current stock, profit margin %
- Color-coded stock badge: green (in stock), yellow (low stock), red (out of stock)

#### Add / Edit Product Modal
Fields:
- Name (required)
- SKU (optional, auto-generate if blank)
- Category (dropdown of `Category` enum values)
- Description (optional)
- Cost Price (required)
- Selling Price (required — show profit margin % live as user types)
- Opening Stock Quantity
- Low Stock Alert Threshold (default 5)
- Product Image (optional file upload)
- Is Active toggle

#### Restock Product
- Quick modal: enter quantity to add, optional note (e.g., "bought from Kantamanto market")
- Updates `stockQty` and logs a restock event

#### Inventory Summary Stats
- Total products
- Total stock value (sum of `costPrice × stockQty`)
- Total potential revenue (sum of `sellingPrice × stockQty`)
- Number of low/out-of-stock items

---

### 5.5 Customer Management (`/customers`)

#### Customer List
- Table with: name, phone, email, total spent, outstanding debt, date added
- Search by name or phone
- Filter: all, has debt, no debt

#### Add / Edit Customer
Fields:
- Full name (required)
- Phone number (optional but recommended)
- Email (optional)
- Address (optional)
- Notes (optional)

#### Customer Detail Page (`/customers/:id`)
- Profile card with all customer info
- Purchase history table — all their past sales
- Debt history — all debts, payments, and current balance
- Edit and delete buttons

---

### 5.6 Debt Tracker (`/debts`)

This is a critical feature. Many clothing sellers give items on credit.

#### Debts Overview
- Summary cards: Total outstanding, Total partially paid, Number of debtors
- Debts table: customer name, original amount, amount paid, balance, due date, status
- Filter by: status (outstanding, partial, settled), overdue (past due date)
- Search by customer name

#### Record Debt Payment
- From the debt row, click "Record Payment"
- Modal with: amount paid, date, notes
- Updates `Debt.amountPaid`, recalculates `Debt.balance`
- If balance reaches 0, sets `Debt.status = SETTLED`
- Logs to `DebtPayment` table

#### Manual Debt Entry
- Debt can be created independently (not tied to a sale)
- Useful for informal credit arrangements
- Fields: customer, amount, due date, notes

#### Overdue Alerts
- Debts where `dueDate < today` and status != SETTLED are highlighted in red
- Overdue count shown in sidebar badge

---

### 5.7 Expense Tracker (`/expenses`)

#### Expense List
- Table of all expenses with: title, category, amount, date, description
- Filter by: category, date range
- Total expenses for selected period shown above table

#### Add Expense
Fields:
- Title (e.g., "Bought 20 dresses from supplier")
- Amount
- Category (dropdown: Restock, Transport, Rent, Marketing, Packaging, Other)
- Description (optional)
- Date (defaults to today)

#### Expense Summary Stats
- Total expenses this month
- Breakdown by category (shown as a donut chart)
- Net profit card: Revenue this month − Cost of goods sold − Expenses

---

### 5.8 Reports (`/reports`)

#### Report Types
| Report | Description |
|--------|-------------|
| Sales Summary | Total revenue, total profit, number of sales for a date range |
| Product Performance | Best-selling products by quantity and by revenue |
| Customer Report | Top customers by spend, frequency of purchase |
| Debt Report | All debts with status breakdown |
| Expense Report | Expenses by category and total |
| Profit & Loss | Revenue − COGS − Expenses = Net Profit for a period |

#### Date Range Selector
- Presets: Today, This Week, This Month, Last Month, Custom Range
- All reports respond to the selected range

#### Export Options
- **Export to PDF** — using jsPDF, clean printable layout
- **Export to Excel** — using SheetJS, full data table
- **Print** — browser print dialog

---

## 6. API Routes (Backend)

All routes prefixed with `/api/v1`. All routes except `/auth/*` require `Authorization: Bearer <token>` header.

### Auth Routes
```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - Login and get JWT
GET    /api/v1/auth/me             - Get current user profile
PUT    /api/v1/auth/profile        - Update profile
PUT    /api/v1/auth/password       - Change password
```

### Sales Routes
```
GET    /api/v1/sales               - List sales (with filters: from, to, status, customerId, paymentMethod)
POST   /api/v1/sales               - Create new sale (creates items, updates stock, creates debt if needed)
GET    /api/v1/sales/:id           - Get single sale with items and customer
PUT    /api/v1/sales/:id           - Update sale (limited: notes, date only)
DELETE /api/v1/sales/:id           - Cancel sale (restores stock, cancels debt)
GET    /api/v1/sales/:id/receipt   - Get receipt data for a sale
```

### Product / Inventory Routes
```
GET    /api/v1/products            - List products (filter: category, lowStock, isActive)
POST   /api/v1/products            - Create new product
GET    /api/v1/products/:id        - Get single product with sale history
PUT    /api/v1/products/:id        - Update product details
DELETE /api/v1/products/:id        - Soft delete (set isActive = false)
POST   /api/v1/products/:id/restock - Add stock quantity
```

### Customer Routes
```
GET    /api/v1/customers           - List customers (search, filter by hasDebt)
POST   /api/v1/customers           - Create customer
GET    /api/v1/customers/:id       - Get customer with sales and debt history
PUT    /api/v1/customers/:id       - Update customer
DELETE /api/v1/customers/:id       - Delete customer (only if no sales)
```

### Debt Routes
```
GET    /api/v1/debts               - List debts (filter: status, overdue)
POST   /api/v1/debts               - Create manual debt
GET    /api/v1/debts/:id           - Get debt with payment history
POST   /api/v1/debts/:id/payment   - Record a payment against a debt
PUT    /api/v1/debts/:id           - Update debt (due date, notes)
```

### Expense Routes
```
GET    /api/v1/expenses            - List expenses (filter: category, from, to)
POST   /api/v1/expenses            - Create expense
PUT    /api/v1/expenses/:id        - Update expense
DELETE /api/v1/expenses/:id        - Delete expense
```

### Reports Routes
```
GET    /api/v1/reports/summary     - Dashboard summary stats (today's revenue, profit, counts)
GET    /api/v1/reports/sales       - Sales report for date range
GET    /api/v1/reports/products    - Product performance report
GET    /api/v1/reports/profit-loss - P&L statement for date range
GET    /api/v1/reports/customers   - Customer report
GET    /api/v1/reports/debts       - Debt summary report
GET    /api/v1/reports/chart/daily - Daily revenue for last N days (for line chart)
GET    /api/v1/reports/chart/category - Revenue by product category (for pie chart)
```

---

## 7. Frontend Pages & Components — Detailed Spec

### AppLayout
- Sidebar (desktop) / Bottom nav (mobile)
- Sidebar items: Dashboard, Sales, Inventory, Customers, Debts, Expenses, Reports, Settings
- Top bar: business name, date, user avatar, logout
- Sidebar badge on Debts showing count of overdue debts (red)

### LoginPage
- Clean centered card
- Email + password fields
- Submit button
- Link to register
- Show validation errors inline

### DashboardPage
- Fetch: `GET /reports/summary`, `GET /reports/chart/daily`, `GET /reports/chart/category`
- 4 stat cards (today's revenue, profit, sales count, outstanding debt)
- Line chart: revenue last 7 days
- Pie chart: sales by category
- Low stock panel (refetch every 5 minutes)
- Recent sales list (last 5)

### SalesPage
- TanStack Table with server-side pagination
- Filter bar: date range pickers, payment method select, status select
- Search input debounced 300ms
- "Record New Sale" button → navigate to `/sales/new`

### NewSalePage
- Multi-step form (steps shown as progress indicator)
- Step 1: product search with react-select, items table, running total
- Step 2: customer select, payment details, notes
- Step 3: review summary, submit
- On success: show receipt modal

### InventoryPage
- Toggle between grid view and table view (persist in localStorage)
- Filter chips for categories
- "Add Product" button → opens modal
- Low stock filter button with count badge

### CustomersPage
- Table with pagination
- Click row → navigate to `/customers/:id`
- "Add Customer" button

### CustomerDetailPage
- Header card with customer info and edit button
- Tabs: Purchase History | Debts
- Purchase history: paginated table of sales
- Debts tab: list of debts with "Record Payment" button on each

### DebtsPage
- Summary stat cards (total owed, number of debtors, overdue count)
- Debts table with status badge (red = overdue, yellow = outstanding, green = settled)
- "Record Payment" opens modal inline

### ExpensesPage
- Filter bar + table
- Donut chart of expenses by category
- Add Expense button

### ReportsPage
- Report type selector (tabs or sidebar)
- Date range picker at top
- Table of results
- Export PDF and Export Excel buttons

---

## 8. Key Business Logic

### Sale Number Generation
```typescript
// Format: CLT-YYYYMMDD-NNNN (sequential per day)
async function generateSaleNumber(userId: string, date: Date): Promise<string> {
  const dateStr = format(date, 'yyyyMMdd');
  const count = await prisma.sale.count({
    where: { userId, saleDate: { gte: startOfDay(date), lte: endOfDay(date) } }
  });
  return `CLT-${dateStr}-${String(count + 1).padStart(4, '0')}`;
}
```

### Profit Margin Display
```typescript
// Show on product cards and inventory table
function profitMargin(cost: number, selling: number): string {
  return (((selling - cost) / cost) * 100).toFixed(1) + '%';
}
```

### Debt Auto-Creation on Sale
When `amountPaid < totalAmount` on a sale:
1. Create the sale with `status = PARTIAL`
2. Auto-create a `Debt` record linked to the sale and customer
3. Set `Debt.balance = totalAmount - amountPaid`
4. If no customer selected (walk-in), prompt user to add a customer name before allowing partial payment

### Stock Validation on Sale
Before saving a sale, validate each item:
- `product.stockQty >= requestedQty` — if not, return 400 error with message "Insufficient stock for [product name]"

### Low Stock Detection
A product is considered low stock when: `stockQty > 0 AND stockQty <= lowStockAlert`
A product is out of stock when: `stockQty === 0`

---

## 9. Environment Variables

### Server `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/clothtrack"
JWT_SECRET="your-very-long-random-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

### Client `.env`
```env
VITE_API_URL="http://localhost:5000/api/v1"
```

---

## 10. Agentic Build Instructions

Follow these steps in order. Complete each step fully before moving to the next.

### Step 1 — Scaffold the project
1. Create monorepo root folder `clothtrack/`
2. Scaffold `/client` with `npm create vite@latest client -- --template react-ts`
3. Install all client dependencies listed in section 2
4. Scaffold `/server` with `npm init` and configure TypeScript
5. Install all server dependencies
6. Create `/shared/types.ts` with shared TypeScript interfaces matching the Prisma schema
7. Set up ESLint and Prettier on both sides
8. Create `.env` files from the templates in section 9

### Step 2 — Database & Prisma
1. Write `prisma/schema.prisma` exactly as defined in section 4
2. Run `npx prisma migrate dev --name init`
3. Write `prisma/seed.ts` with sample data: 1 user, 10 products across different categories, 5 customers, 8 sales, 3 debts
4. Run `npx prisma db seed`

### Step 3 — Backend: Auth
1. Write `auth.controller.ts` with register, login, me, updateProfile, changePassword
2. Write `auth.middleware.ts` to verify JWT and attach `req.user`
3. Write `auth.routes.ts`
4. Test all auth endpoints

### Step 4 — Backend: Core CRUD
1. Build Products controller, routes, and validation
2. Build Customers controller and routes
3. Build Expenses controller and routes

### Step 5 — Backend: Sales (most complex)
1. Build sales controller with the full transaction logic:
    - Validate stock for all items
    - Create Sale + SaleItems in a Prisma transaction
    - Decrement stock for each product
    - Create Debt if balance owed > 0
    - Update Customer.totalSpent
2. Build the cancel sale logic (reverse stock, cancel debt)
3. Build receipt endpoint

### Step 6 — Backend: Debts & Reports
1. Build debts controller with payment recording
2. Build all report endpoints from section 6
3. Ensure report queries are efficient with proper Prisma aggregations

### Step 7 — Frontend: Foundation
1. Set up React Router with all routes from section 3
2. Configure Axios instance with base URL and JWT interceptor
3. Build AppLayout (sidebar + topbar)
4. Build LoginPage and connect to auth API
5. Set up Zustand auth store
6. Set up TanStack Query provider

### Step 8 — Frontend: Dashboard
1. Build all stat card components
2. Build chart components (line, pie, bar) with Recharts
3. Build DashboardPage fetching all required data
4. Build low stock panel and recent sales widgets

### Step 9 — Frontend: Sales & Inventory
1. Build the multi-step NewSalePage (most complex screen)
2. Build SalesPage with filtering and pagination
3. Build receipt modal with print functionality
4. Build InventoryPage with product cards
5. Build ProductForm modal with live margin calculator

### Step 10 — Frontend: Customers, Debts, Expenses, Reports
1. Build CustomersPage and CustomerDetailPage
2. Build DebtsPage with payment recording modal
3. Build ExpensesPage with donut chart
4. Build ReportsPage with all report types and export functionality

### Step 11 — Polish & Final Checks
1. Add loading skeletons on all data-fetching pages
2. Add error boundary components
3. Ensure all forms have proper Zod validation and inline error messages
4. Make sidebar responsive (collapsible on mobile, bottom nav on small screens)
5. Add overdue debt badge to sidebar
6. Test the full sale creation flow end to end
7. Test export to PDF and Excel

---

## 11. UI/UX Guidelines

- **Primary color:** Indigo (`#4F46E5`) — use for buttons, active states, links
- **Success/positive:** Green (`#16A34A`) — use for profit numbers, settled debts
- **Warning:** Amber (`#D97706`) — use for low stock, partial debts
- **Danger:** Red (`#DC2626`) — use for out of stock, overdue debts, negative numbers
- **Font:** Inter (loaded via Google Fonts)
- All monetary values formatted with the user's currency (default: GHS ₵)
- Dates formatted as `DD MMM YYYY` (e.g., 01 Jun 2024)
- Numbers formatted with commas for thousands (e.g., 1,250.00)
- All tables have hover states on rows
- Empty states: show an illustration + helpful message (e.g., "No sales yet. Record your first sale!")
- All modals are accessible (focus trap, ESC to close, backdrop click to close)
- Toast notifications for all success/error actions

---

## 12. Security Checklist

- [ ] Passwords hashed with bcrypt (min 10 rounds)
- [ ] JWT tokens expire in 7 days
- [ ] All routes (except auth) verify JWT before responding
- [ ] All database queries scoped to `userId` — users can only see their own data
- [ ] Input validated with Zod on both client and server
- [ ] Rate limiting on auth endpoints (max 10 requests/15 min per IP)
- [ ] CORS configured to allow only the client URL
- [ ] No sensitive data (passwords, JWT secret) in version control
- [ ] SQL injection not possible (Prisma ORM parameterises all queries)

---

*End of ClothTrack Master Prompt — v1.0*