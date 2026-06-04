import { useInventory } from "@/hooks/use-inventory";
import { Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LowStockWidget() {
  const { products, isLoading } = useInventory();
  const lowStockProducts = products.filter((p: any) => p.stockQty <= p.lowStockAlert).slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Low Stock Alerts</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Items needing restock</p>
        </div>
        <Badge variant="destructive" className="h-5">{lowStockProducts.length}</Badge>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading stock...</p>
        ) : lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-2">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">All items well stocked</p>
          </div>
        ) : (
          lowStockProducts.map((product: any) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-warning/10 flex items-center justify-center text-warning">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category.toLowerCase()}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-destructive">{product.stockQty}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Left</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
