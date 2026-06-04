"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { RecentSalesWidget } from "@/components/dashboard/recent-sales-widget";
import { LowStockWidget } from "@/components/dashboard/low-stock-widget";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function OverviewSection() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading dashboard stats...</div>;
  }

  const stats = data || {
    todayRevenue: 0,
    todayProfit: 0,
    salesCount: 0,
    outstandingDebt: 0,
  };

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Revenue"
          value={`₵${stats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          delay={0}
        />
        <MetricCard
          title="Today's Profit"
          value={`₵${stats.todayProfit.toLocaleString()}`}
          icon={TrendingUp}
          delay={1}
        />
        <MetricCard
          title="Sales Count"
          value={stats.salesCount.toString()}
          icon={ShoppingBag}
          delay={2}
        />
        <MetricCard
          title="Outstanding Debt"
          value={`₵${stats.outstandingDebt.toLocaleString()}`}
          icon={CreditCard}
          delay={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalesWidget />
        <LowStockWidget />
      </div>
    </div>
  );
}
