import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText, Package, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useBusinessReport } from "@/hooks/use-dashboard-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const money = (value: number) => `₵${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const exportSpreadsheet = (filename: string, rows: any[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const table = `
    <table>
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ""}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
  const blob = new Blob([table], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportPdf = (title: string, rows: any[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const table = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Poppins, Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { font-size: 20px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </body>
    </html>
  `;
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (!printWindow) return;
  printWindow.document.write(table);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

function ExportControl({ label, filename, rows }: { label: string; filename: string; rows: any[] }) {
  const [format, setFormat] = useState("spreadsheet");

  return (
    <div className="flex items-center gap-2">
      <Select value={format} onValueChange={setFormat}>
        <SelectTrigger className="h-8 w-[132px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={rows.length === 0}
        onClick={() => format === "pdf" ? exportPdf(label, rows) : exportSpreadsheet(filename, rows)}
      >
        <Download className="w-4 h-4" />
        Export
      </Button>
    </div>
  );
}

function ReportMetric({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsSection() {
  const [from, setFrom] = useState(format(subDays(new Date(), 29), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const params = useMemo(() => ({ from, to }), [from, to]);
  const { data, isLoading } = useBusinessReport(params);

  const summary = data?.summary || {
    totalRevenue: 0,
    totalPaid: 0,
    totalBalance: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    salesCount: 0,
    lowStockCount: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports</h2>
          <p className="text-muted-foreground">Review sales, profit, inventory, expenses, and customer balances</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">From</span>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">To</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center text-muted-foreground">Loading reports...</CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <ReportMetric title="Revenue" value={money(summary.totalRevenue)} icon={TrendingUp} />
            <ReportMetric title="Net Profit" value={money(summary.netProfit)} icon={Wallet} />
            <ReportMetric title="Expenses" value={money(summary.totalExpenses)} icon={Receipt} />
            <ReportMetric title="Customer Balances" value={money(summary.totalBalance)} icon={FileText} />
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Revenue vs Expenses</CardTitle>
              <ExportControl label="Daily Report" filename="daily-report.xls" rows={data?.daily || []} />
            </CardHeader>
            <CardContent className="pt-6 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.daily || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reportRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.56 0.14 245)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.56 0.14 245)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="reportExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.18 25)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="oklch(0.62 0.18 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value}`} />
                  <Tooltip formatter={(value: number, name: string) => [money(value), name]} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.56 0.14 245)" fill="url(#reportRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="oklch(0.62 0.18 25)" fill="url(#reportExpenses)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                <CardTitle className="text-base font-semibold">Top Products</CardTitle>
                <ExportControl label="Top Products" filename="top-products.xls" rows={data?.topProducts || []} />
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Revenue</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data?.topProducts || []).map((item: any) => (
                      <tr key={item.productId}><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3 text-right">{item.quantity}</td><td className="px-4 py-3 text-right">{money(item.revenue)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                <CardTitle className="text-base font-semibold">Customer Balances</CardTitle>
                <ExportControl label="Customer Balances" filename="customer-balances.xls" rows={data?.balances || []} />
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Sale</th><th className="px-4 py-3 text-right">Owes</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data?.balances || []).map((balance: any) => (
                      <tr key={balance.id}><td className="px-4 py-3">{balance.customer}</td><td className="px-4 py-3">{balance.saleNumber}</td><td className="px-4 py-3 text-right">{money(balance.balance)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle className="flex items-center gap-2 text-base font-semibold"><Package className="w-4 h-4" /> Inventory Status</CardTitle>
              <ExportControl label="Inventory Status" filename="inventory-status.xls" rows={data?.inventory || []} />
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-right">Stock</th><th className="px-4 py-3 text-right">Stock Value</th><th className="px-4 py-3 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(data?.inventory || []).slice(0, 12).map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3 text-right">{product.stockQty}</td>
                      <td className="px-4 py-3 text-right">{money(product.stockValue)}</td>
                      <td className="px-4 py-3 text-right"><Badge variant={product.lowStock ? "destructive" : "secondary"}>{product.lowStock ? "Low Stock" : "OK"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
