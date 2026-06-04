import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SaleViewDialogProps {
  sale: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleViewDialog({ sale, open, onOpenChange }: SaleViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader><DialogTitle>Sale Details</DialogTitle></DialogHeader>
        {sale && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><div className="text-muted-foreground">Sale</div><div className="font-medium">{sale.saleNumber}</div></div>
              <div><div className="text-muted-foreground">Customer</div><div className="font-medium">{sale.customer?.name || "Walk-in"}</div></div>
              <div><div className="text-muted-foreground">Date</div><div className="font-medium">{format(new Date(sale.saleDate), "MMM dd, yyyy")}</div></div>
              <div><div className="text-muted-foreground">Status</div><Badge>{sale.status}</Badge></div>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Unit</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(sale.items || []).map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.product?.name || "Product"}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₵{item.unitPrice}</td>
                      <td className="px-4 py-3 text-right">₵{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary p-4 text-sm">
              <div><div className="text-muted-foreground">Total</div><div className="font-semibold">₵{sale.totalAmount}</div></div>
              <div><div className="text-muted-foreground">Paid</div><div className="font-semibold">₵{sale.amountPaid}</div></div>
              <div><div className="text-muted-foreground">Balance</div><div className="font-semibold">₵{sale.balanceOwed}</div></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
