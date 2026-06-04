import { useSales } from "@/hooks/use-sales";
import { format } from "date-fns";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RecentSalesWidget() {
  const { sales, isLoading } = useSales();
  const recentSales = sales.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Sales</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Latest transactions</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading sales...</p>
        ) : recentSales.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No sales yet.</p>
        ) : (
          recentSales.map((sale: any, index: number) => (
            <div
              key={sale.id}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.customer?.name || 'Walk-in'}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(sale.saleDate), 'MMM dd, h:mm a')}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">₵{sale.totalAmount}</p>
                <Badge variant={sale.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1">
                  {sale.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
