import { useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DebtPaymentForm } from "@/components/dashboard/debt-payment-form";

export function DebtsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDebt, setSelectedDebt] = useState<any | null>(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const { debts, isLoading } = useDebts();

  const filteredDebts = debts.filter((d: any) =>
    d.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.sale && d.sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Balances</h2>
          <p className="text-muted-foreground">Track money customers still owe your business</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search customers or sale number..."
          className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base font-semibold">Outstanding Customer Balances</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 md:px-6 py-4 font-medium">Customer</th>
                  <th className="hidden sm:table-cell px-6 py-4 font-medium">Sale</th>
                  <th className="px-4 md:px-6 py-4 font-medium">Owes</th>
                  <th className="hidden xs:table-cell px-6 py-4 font-medium">Status</th>
                  <th className="px-4 md:px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center text-muted-foreground">
                      Loading customer balances...
                    </td>
                  </tr>
                ) : filteredDebts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center text-muted-foreground">
                      No outstanding customer balances found.
                    </td>
                  </tr>
                ) : (
                  filteredDebts.map((debt: any) => (
                    <tr key={debt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-medium text-foreground">{debt.customer.name}</div>
                        <div className="sm:hidden text-xs text-muted-foreground mt-0.5">{debt.sale?.saleNumber || 'Manual Balance'}</div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">{debt.sale?.saleNumber || 'Manual Balance'}</td>
                      <td className="px-4 md:px-6 py-4 font-medium text-foreground">₵{debt.balance.toLocaleString()}</td>
                      <td className="hidden xs:table-cell px-6 py-4">
                        <Badge variant={debt.status === 'OUTSTANDING' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 h-5">
                          {debt.status}
                        </Badge>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs px-2 md:px-3"
                          onClick={() => {
                            setSelectedDebt(debt);
                            setPaymentFormOpen(true);
                          }}
                        >
                          Collect
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <DebtPaymentForm
        debt={selectedDebt}
        open={paymentFormOpen}
        onOpenChange={setPaymentFormOpen}
      />
    </div>
  );
}
