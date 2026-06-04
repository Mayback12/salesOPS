import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSales } from "@/hooks/use-sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DebtPaymentForm } from "@/components/dashboard/debt-payment-form";
import { SaleViewDialog } from "@/components/dashboard/sale-view-dialog";

export function SalesSection() {
  const navigate = useNavigate();
  const { sales, isLoading } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDebt, setSelectedDebt] = useState<any | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [saleViewOpen, setSaleViewOpen] = useState(false);

  const filteredSales = sales.filter((s: any) =>
    s.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.customer && s.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sales</h2>
          <p className="text-muted-foreground">Track your revenue and customer transactions</p>
        </div>
        <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          onClick={() => navigate("/sales/new")}
        >
          <Plus className="w-4 h-4" />
          Record New Sale
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search sales by number or customer..."
          className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Sale Number</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Loading sales...
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No sales found.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale: any) => {
                    const balanceOwed = Number(sale.balanceOwed || 0);
                    return (
                      <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{sale.saleNumber}</td>
                        <td className="px-6 py-4">{sale.customer?.name || 'Walk-in'}</td>
                        <td className="px-6 py-4">{format(new Date(sale.saleDate), 'MMM dd, yyyy')}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">₵{sale.totalAmount}</div>
                          <div className="text-xs text-muted-foreground">Paid: ₵{sale.amountPaid}</div>
                          {balanceOwed > 0 && (
                            <div className="text-xs text-destructive">Customer owes: ₵{balanceOwed.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={sale.status === 'COMPLETED' ? 'default' : sale.status === 'PARTIAL' ? 'secondary' : 'destructive'}>
                            {sale.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {balanceOwed > 0 && sale.debt ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDebt({
                                  ...sale.debt,
                                  customer: sale.customer || { name: 'Walk-in' },
                                  sale: { saleNumber: sale.saleNumber },
                                });
                                setCollectionOpen(true);
                              }}
                            >
                              Collect Balance
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSale(sale);
                                setSaleViewOpen(true);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <DebtPaymentForm
        debt={selectedDebt}
        open={collectionOpen}
        onOpenChange={setCollectionOpen}
      />
      <SaleViewDialog
        sale={selectedSale}
        open={saleViewOpen}
        onOpenChange={setSaleViewOpen}
      />
    </div>
  );
}
