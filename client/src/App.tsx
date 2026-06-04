import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { CustomersSection } from "@/components/dashboard/sections/customers";
import { ReportsSection } from "@/components/dashboard/sections/reports";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import { InventorySection } from "@/components/dashboard/sections/inventory";
import { ExpensesSection } from "@/components/dashboard/sections/expenses";
import { SalesSection } from "@/components/dashboard/sections/sales";
import { DebtsSection } from "@/components/dashboard/sections/debts";
import LoginPage from "@/pages/auth/login-page";
import { useAuthStore } from "@/stores/auth-store";
import { ProductCreatePage } from "@/pages/create/product-create-page";
import { CustomerCreatePage } from "@/pages/create/customer-create-page";
import { ExpenseCreatePage } from "@/pages/create/expense-create-page";
import { SaleCreatePage } from "@/pages/create/sale-create-page";

export type Section = "overview" | "inventory" | "sales" | "customers" | "debts" | "expenses" | "reports" | "settings";

const sectionPaths: Record<Section, string> = {
  overview: "/overview",
  inventory: "/inventory",
  sales: "/sales",
  customers: "/customers",
  debts: "/balances",
  expenses: "/expenses",
  reports: "/reports",
  settings: "/settings",
};

const sectionFromPath = (pathname: string): Section => {
  if (pathname.startsWith("/inventory")) return "inventory";
  if (pathname.startsWith("/sales")) return "sales";
  if (pathname.startsWith("/customers")) return "customers";
  if (pathname.startsWith("/balances") || pathname.startsWith("/debts")) return "debts";
  if (pathname.startsWith("/expenses")) return "expenses";
  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/settings")) return "settings";
  return "overview";
};

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const activeSection = sectionFromPath(location.pathname);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Checking session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSectionChange = (section: Section) => {
    navigate(sectionPaths[section]);
  };

  const sectionView = (section: Section, element: React.ReactNode) => (
    <div
      key={section}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {element}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        <Header activeSection={activeSection} />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={sectionView("overview", <OverviewSection />)} />
            <Route path="/inventory" element={sectionView("inventory", <InventorySection />)} />
            <Route path="/inventory/new" element={<ProductCreatePage />} />
            <Route path="/sales" element={sectionView("sales", <SalesSection />)} />
            <Route path="/customers" element={sectionView("customers", <CustomersSection />)} />
            <Route path="/customers/new" element={<CustomerCreatePage />} />
            <Route path="/expenses" element={sectionView("expenses", <ExpensesSection />)} />
            <Route path="/expenses/new" element={<ExpenseCreatePage />} />
            <Route path="/sales/new" element={<SaleCreatePage />} />
            <Route path="/balances" element={sectionView("debts", <DebtsSection />)} />
            <Route path="/debts" element={<Navigate to="/balances" replace />} />
            <Route path="/reports" element={sectionView("reports", <ReportsSection />)} />
            <Route path="/settings" element={sectionView("settings", <SettingsSection />)} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}
